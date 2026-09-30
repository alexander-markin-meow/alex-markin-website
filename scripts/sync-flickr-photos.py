#!/usr/bin/env python3
"""Refresh the locally hosted photo selection from the public Flickr album."""
import json
from pathlib import Path
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
OWNER = "194911743@N06"
ALBUM = "72177720334709474"
ALBUM_URL = f"https://www.flickr.com/photos/{OWNER}/albums/{ALBUM}/"


def read_url(url):
    with urlopen(url, timeout=30) as response:
        return response.read()


def main():
    html = read_url(ALBUM_URL).decode("utf-8")
    exported, _ = json.JSONDecoder().raw_decode(html.split("modelExport: ", 1)[1])
    album = exported["main"]["set-models"][0]["data"]
    page = album["photoPageList"]["data"]
    if not page["fetchedEnd"] or len(page["_data"]) != page["totalItems"]:
        raise RuntimeError("Album was only partially loaded; existing photos remain unchanged.")
    if not page["_data"]:
        raise RuntimeError("Album is empty; existing photos remain unchanged.")

    photos = []
    directory = ROOT / "flickr-photos"
    directory.mkdir(exist_ok=True)
    for entry in page["_data"]:
        photo = entry["data"]
        photo_id = str(photo["id"])
        if not photo_id.isdigit():
            raise ValueError("Invalid Flickr photo ID")
        size = photo["sizes"]["data"]["z"]["data"]
        path = directory / f"{photo_id}.jpg"
        if not path.exists():
            path.write_bytes(read_url("https:" + size["displayUrl"]))
        photos.append({
            "src": f"flickr-photos/{photo_id}.jpg",
            "title": photo["title"].lower() or "untitled",
            "href": f"https://www.flickr.com/photos/{OWNER}/{photo_id}/in/set-{ALBUM}/",
            "width": size["width"],
            "height": size["height"],
        })
    (ROOT / "flickr-photos.json").write_text(
        json.dumps(photos, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Synced {len(photos)} photos from {ALBUM_URL}")


if __name__ == "__main__":
    main()
