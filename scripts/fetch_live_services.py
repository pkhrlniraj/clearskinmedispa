#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import ssl
import sys
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from typing import Dict, List, Optional
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen


SERVICES = [
    ("laser-hair-removal", "https://clearskinmedispa.com/laser-hair-removal/"),
    ("oxygeneo", "https://clearskinmedispa.com/oxygeneo/"),
    ("chemical-peel", "https://clearskinmedispa.com/chemical-peel/"),
    ("microneedling", "https://clearskinmedispa.com/microneedling/"),
    ("dermaplaning", "https://clearskinmedispa.com/dermaplaning/"),
    ("microblading", "https://clearskinmedispa.com/microblading/"),
    ("hydrafacial", "https://clearskinmedispa.com/hydrafacial/"),
    ("microdermabrasion", "https://clearskinmedispa.com/microdermabrasion/"),
    ("led-light-therapy", "https://clearskinmedispa.com/led-light-therapy/"),
    ("facials", "https://clearskinmedispa.com/facials/"),
    ("waxing", "https://clearskinmedispa.com/waxing/"),
    ("rf-skin-tightening", "https://clearskinmedispa.com/rf-skin-tightening/"),
    ("other-services", "https://clearskinmedispa.com/other-services/"),
]

ROOT = Path(__file__).resolve().parents[1]
WORK_ROOT = ROOT / "work" / "live-service-crawl"
MEDIA_ROOT = ROOT / "src" / "assets" / "media" / "live-services"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": (
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,"
        "image/webp,image/apng,*/*;q=0.8"
    ),
    "Accept-Language": "en-CA,en-US;q=0.9,en;q=0.8",
    "Cache-Control": "no-cache",
}
SSL_CONTEXT = ssl._create_unverified_context()

BLOCK_TAGS = {"h1", "h2", "h3", "h4", "h5", "h6", "p", "li"}
IGNORE_TAGS = {"script", "style", "noscript", "svg"}
STOP_HEADINGS = {
    "contact us",
    "services",
    "our services",
    "popular services",
    "book now",
}


def normalize_space(text: str) -> str:
    return re.sub(r"\s+", " ", unescape(text or "")).strip()


def make_request(url: str, accept: Optional[str] = None) -> Request:
    headers = dict(HEADERS)
    if accept:
        headers["Accept"] = accept
    return Request(url, headers=headers)


class ServicePageParser(HTMLParser):
    def __init__(self, page_url: str) -> None:
        super().__init__(convert_charrefs=True)
        self.page_url = page_url
        self.started = False
        self.stopped = False
        self.ignore_depth = 0
        self.capture_depth = 0
        self.current: Optional[Dict[str, List[str] | str]] = None
        self.blocks: List[Dict[str, str]] = []
        self.images: List[Dict[str, str]] = []
        self.title = ""

    def handle_starttag(self, tag: str, attrs: List[tuple[str, Optional[str]]]) -> None:
        if tag in IGNORE_TAGS:
            self.ignore_depth += 1
            return
        if self.ignore_depth or self.stopped:
            return

        attrs_map = {key: value or "" for key, value in attrs}
        class_names = attrs_map.get("class", "")

        if tag == "div" and "entry-content" in class_names:
            self.started = True
            self.capture_depth = 1
            return

        if self.started and tag == "div" and self.capture_depth:
            self.capture_depth += 1

        if tag == "img" and self.started and self.capture_depth:
            src = (
                attrs_map.get("data-lazy-src")
                or attrs_map.get("data-src")
                or attrs_map.get("src")
            )
            alt = normalize_space(attrs_map.get("alt", ""))
            if src and not src.startswith("data:"):
                absolute = urljoin(self.page_url, src)
                if absolute not in {image["source"] for image in self.images}:
                    self.images.append({"source": absolute, "alt": alt})
            return

        if self.started and self.capture_depth and tag in BLOCK_TAGS:
            self.current = {"tag": tag, "parts": []}

    def handle_endtag(self, tag: str) -> None:
        if tag in IGNORE_TAGS and self.ignore_depth:
            self.ignore_depth -= 1
            return
        if self.ignore_depth or self.stopped:
            return
        if self.started and tag == "div" and self.capture_depth:
            self.capture_depth -= 1
            if self.capture_depth == 0:
                self.stopped = True
                return
        if self.current and self.current["tag"] == tag:
            text = normalize_space(" ".join(self.current["parts"]))  # type: ignore[arg-type]
            self.current = None
            if not text:
                return

            if tag in {"h1", "h2"} and not self.title:
                self.title = text

            if tag in {"h2", "h3", "h4", "h5", "h6"} and len(self.blocks) > 6 and text.lower() in STOP_HEADINGS:
                self.stopped = True
                return

            self.blocks.append({"tag": tag, "text": text})

    def handle_data(self, data: str) -> None:
        if self.ignore_depth or self.stopped or not self.current or not self.capture_depth:
            return
        text = normalize_space(data)
        if text:
            parts = self.current["parts"]  # type: ignore[index]
            parts.append(text)


def fetch_bytes(url: str, accept: Optional[str] = None) -> bytes:
    request = make_request(url, accept=accept)
    with urlopen(request, timeout=30, context=SSL_CONTEXT) as response:
        return response.read()


def fetch_html(url: str) -> str:
    return fetch_bytes(url).decode("utf-8", "ignore")


def parse_service_page(url: str, html: str) -> Dict[str, object]:
    parser = ServicePageParser(url)
    parser.feed(html)
    parser.close()
    return {
        "url": url,
        "title": parser.title,
        "blocks": parser.blocks,
        "images": parser.images,
    }


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def file_extension(source_url: str, content_type: str) -> str:
    parsed = urlparse(source_url)
    suffix = Path(parsed.path).suffix.lower()
    if suffix in {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}:
        return suffix
    if "png" in content_type:
        return ".png"
    if "webp" in content_type:
        return ".webp"
    if "gif" in content_type:
        return ".gif"
    if "svg" in content_type:
        return ".svg"
    return ".jpg"


def slugify_filename(text: str) -> str:
    cleaned = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return cleaned or "image"


def download_image(source_url: str, target_dir: Path, index: int) -> Dict[str, str]:
    request = make_request(
        source_url,
        accept="image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
    )
    with urlopen(request, timeout=30, context=SSL_CONTEXT) as response:
        content = response.read()
        content_type = response.headers.get("Content-Type", "").lower()

    parsed = urlparse(source_url)
    stem = slugify_filename(Path(parsed.path).stem or f"image-{index:02d}")
    ext = file_extension(source_url, content_type)
    filename = f"{index:02d}-{stem}{ext}"
    local_path = target_dir / filename
    local_path.write_bytes(content)

    return {
        "source": source_url,
        "localPath": str(local_path.relative_to(ROOT)).replace("\\", "/"),
        "fileName": filename,
    }


def build_markdown(snapshot: Dict[str, object]) -> str:
    lines = [f"# {snapshot['title']}", "", f"Source: {snapshot['url']}", ""]
    lines.append("## Images")
    for image in snapshot["images"]:  # type: ignore[index]
        lines.append(f"- {image['source']}")  # type: ignore[index]
    lines.append("")
    lines.append("## Content Blocks")
    for block in snapshot["blocks"]:  # type: ignore[index]
        lines.append(f"- `{block['tag']}` {block['text']}")  # type: ignore[index]
    lines.append("")
    return "\n".join(lines)


def crawl_one(slug: str, url: str) -> Dict[str, object]:
    html = fetch_html(url)
    snapshot = parse_service_page(url, html)

    page_dir = WORK_ROOT / slug
    ensure_dir(page_dir)
    ensure_dir(MEDIA_ROOT / slug)

    (page_dir / "raw.html").write_text(html, encoding="utf-8")

    downloaded = []
    for index, image in enumerate(snapshot["images"], start=1):  # type: ignore[index]
        try:
            downloaded.append(download_image(image["source"], MEDIA_ROOT / slug, index))  # type: ignore[index]
        except (HTTPError, URLError, TimeoutError) as exc:
            downloaded.append(
                {
                    "source": image["source"],  # type: ignore[index]
                    "error": f"{type(exc).__name__}: {exc}",
                }
            )

    snapshot["downloadedImages"] = downloaded
    (page_dir / "snapshot.json").write_text(
        json.dumps(snapshot, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    (page_dir / "summary.md").write_text(build_markdown(snapshot), encoding="utf-8")
    return snapshot


def parse_saved_html(slug: str, url: str) -> Dict[str, object]:
    page_dir = WORK_ROOT / slug
    html = (page_dir / "raw.html").read_text(encoding="utf-8")
    snapshot = parse_service_page(url, html)

    downloaded = []
    ensure_dir(MEDIA_ROOT / slug)
    for index, image in enumerate(snapshot["images"], start=1):  # type: ignore[index]
        try:
            downloaded.append(download_image(image["source"], MEDIA_ROOT / slug, index))  # type: ignore[index]
        except (HTTPError, URLError, TimeoutError) as exc:
            downloaded.append(
                {
                    "source": image["source"],  # type: ignore[index]
                    "error": f"{type(exc).__name__}: {exc}",
                }
            )

    snapshot["downloadedImages"] = downloaded
    (page_dir / "snapshot.json").write_text(
        json.dumps(snapshot, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    (page_dir / "summary.md").write_text(build_markdown(snapshot), encoding="utf-8")
    return snapshot


def main() -> int:
    ensure_dir(WORK_ROOT)
    ensure_dir(MEDIA_ROOT)

    reparse_only = "--reparse-local" in sys.argv[1:]
    results = []
    failures = []
    for slug, url in SERVICES:
        try:
            snapshot = parse_saved_html(slug, url) if reparse_only else crawl_one(slug, url)
            results.append(
                {
                    "slug": slug,
                    "title": snapshot["title"],
                    "url": url,
                    "blockCount": len(snapshot["blocks"]),  # type: ignore[arg-type]
                    "imageCount": len(snapshot["images"]),  # type: ignore[arg-type]
                    "downloadedCount": len(snapshot["downloadedImages"]),  # type: ignore[arg-type]
                }
            )
            print(f"[ok] {slug}: {snapshot['title']}")
        except Exception as exc:  # noqa: BLE001
            failures.append({"slug": slug, "url": url, "error": f"{type(exc).__name__}: {exc}"})
            print(f"[error] {slug}: {exc}", file=sys.stderr)

    manifest = {"results": results, "failures": failures}
    (WORK_ROOT / "manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    if failures:
        print(json.dumps(failures, indent=2), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
