#!/usr/bin/env bash
set -euo pipefail

GALLERY_DIR="images/gallery"
OUTPUT_FILE="images.json"

if [ ! -d "$GALLERY_DIR" ]; then
  echo "Папка $GALLERY_DIR не найдена, создаю пустой $OUTPUT_FILE"
  echo '{}' > "$OUTPUT_FILE"
  exit 0
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "Ошибка: требуется jq" >&2
  exit 1
fi

result="{}"
total_images=0
folder_count=0

# Идём по подпапкам images/gallery в алфавитном порядке
while IFS= read -r folder; do
  folder_name=$(basename "$folder")
  folder_count=$((folder_count + 1))

  # Собираем json-объекты {name, description} построчно, затем сворачиваем в массив
  files_json=$(
    find "$folder" -maxdepth 1 -type f \( \
        -iname "*.jpg"  -o -iname "*.jpeg" -o -iname "*.png" \
        -o -iname "*.gif"  -o -iname "*.webp" -o -iname "*.bmp" \
        -o -iname "*.svg" \
      \) -print0 \
      | sort -z \
      | while IFS= read -r -d '' file; do
          file_name=$(basename "$file")
          base_name="${file_name%.*}"
          desc_file="${folder%/}/${base_name}.json"

          description=""
          if [ -f "$desc_file" ]; then
            # Поддерживаем как {"description": "..."} так и просто "строку" в файле
            description=$(jq -r 'if type == "string" then . elif (type == "object" and has("description")) then .description else "" end' "$desc_file" 2>/dev/null) || description=""
          fi

          jq -n --arg name "$file_name" --arg desc "$description" '{name: $name, description: $desc}'
        done \
      | jq -s '.'
  )

  count=$(echo "$files_json" | jq 'length')
  total_images=$((total_images + count))

  result=$(echo "$result" | jq --arg folder "$folder_name" --argjson files "$files_json" '.[$folder] = $files')
done < <(find "$GALLERY_DIR" -mindepth 1 -maxdepth 1 -type d | sort)

echo "$result" | jq '.' > "$OUTPUT_FILE"

echo "Готово: $OUTPUT_FILE сгенерирован"
echo "Папок: $folder_count"
echo "Всего картинок: $total_images"