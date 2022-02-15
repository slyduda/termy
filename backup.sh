#!/bin/sh

now=$(date +"%s")
DB_TMP="/var/termy/temp"
DB_SRC="/var/termy/database.sqlite"
DB_BAK="/var/termy/temp/backup."
DB_DST="/var/termy/backups/backup."

mkdir "${DB_TMP}"
sqlite3 "${DB_SRC}" ".backup ${DB_BAK}${now}"
tar -czf "${DB_DST}${now}.tar.gz" "${DB_BAK}${now}"
rm -rf "${DB_TMP}"
