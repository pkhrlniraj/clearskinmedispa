#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT_ROOT = ROOT / "work" / "live-service-crawl"
OUTPUT = ROOT / "src" / "_data" / "serviceContentImports.js"

HEADING_TAGS = {"h2", "h3"}
SUBHEADING_TAGS = {"h4", "h5", "h6"}
SKIP_SECTIONS = {"faq"}


def web_path(local_path: str) -> str:
    normalized = local_path.replace("\\", "/").lstrip("/")
    if normalized.startswith("src/"):
        normalized = normalized[4:]
    return "/" + normalized


def clean_section(section: dict) -> dict:
    cleaned = {
        "title": section["title"],
        "paragraphs": [p for p in section.get("paragraphs", []) if p],
        "list": [item for item in section.get("list", []) if item],
        "subsections": [],
    }

    for subsection in section.get("subsections", []):
        if subsection.get("paragraphs") or subsection.get("list"):
            cleaned["subsections"].append(
                {
                    "title": subsection["title"],
                    "paragraphs": [p for p in subsection.get("paragraphs", []) if p],
                    "list": [item for item in subsection.get("list", []) if item],
                }
            )

    return cleaned


def build_sections(blocks: list[dict], title: str) -> tuple[dict | None, list[dict], str | None]:
    sections: list[dict] = []
    current: dict | None = None
    current_subsection: dict | None = None
    gallery_title = None

    for block in blocks:
        tag = block["tag"]
        text = block["text"].strip()
        if not text:
            continue

        if tag in HEADING_TAGS:
            current = {
                "title": text,
                "paragraphs": [],
                "list": [],
                "subsections": [],
            }
            current_subsection = None
            sections.append(current)
            continue

        if tag in SUBHEADING_TAGS and current:
            current_subsection = {
                "title": text,
                "paragraphs": [],
                "list": [],
            }
            current["subsections"].append(current_subsection)
            continue

        target = current_subsection or current
        if not target:
            continue

        if tag == "p":
            target["paragraphs"].append(text)
        elif tag == "li":
            target["list"].append(text)

    cleaned_sections = [clean_section(section) for section in sections]
    cleaned_sections = [
        section
        for section in cleaned_sections
        if section["paragraphs"] or section["list"] or section["subsections"]
    ]

    overview = None
    if cleaned_sections and cleaned_sections[0]["title"].strip().lower() == title.strip().lower():
        overview = cleaned_sections.pop(0)

    filtered_sections = []
    for section in cleaned_sections:
        normalized_title = section["title"].strip().lower()
        if normalized_title in SKIP_SECTIONS:
            continue
        if "before & after" in normalized_title or "before and after" in normalized_title:
            gallery_title = section["title"]
            continue
        filtered_sections.append(section)

    return overview, filtered_sections, gallery_title


def build_import(snapshot_path: Path) -> tuple[str, dict]:
    data = json.loads(snapshot_path.read_text(encoding="utf-8"))
    slug = snapshot_path.parent.name
    title = data.get("title") or slug.replace("-", " ").title()

    image_pool = [
        web_path(item["localPath"])
        for item in data.get("downloadedImages", [])
        if item.get("localPath")
    ]

    primary_image = image_pool[0] if image_pool else None
    section_images = image_pool[1:]

    overview, content_sections, gallery_title = build_sections(data.get("blocks", []), title)

    for section in content_sections:
        if section_images:
            section["image"] = section_images.pop(0)
            section["imageAlt"] = section["title"]

    gallery_images = [
        {
            "src": src,
            "alt": title,
        }
        for src in section_images
    ]

    result = {
        "title": title,
        "primaryImage": primary_image,
        "primaryImageAlt": title,
        "overview": overview,
        "contentSections": content_sections,
        "galleryTitle": gallery_title or "Treatment Images",
        "galleryImages": gallery_images,
    }

    return slug, result


def main() -> int:
    imports = {}
    for snapshot_path in sorted(SNAPSHOT_ROOT.glob("*/snapshot.json")):
        slug, payload = build_import(snapshot_path)
        imports[slug] = payload

    js = "module.exports = " + json.dumps(imports, indent=2, ensure_ascii=False) + ";\n"
    OUTPUT.write_text(js, encoding="utf-8")
    print(f"Wrote {OUTPUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
