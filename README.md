# Digital Advent Calendar

Open `index.html` in a browser to use the calendar.

The calendar has 24 numbered doors. The door numbers are shuffled across the grid, so the recipient has to look for the date like a traditional advent calendar.

Gift rules:

- 4 gifts per category across snacks, photos, notes, objects, songs, and dates.
- December 4 is locked to the date gift `Cine-concert`.
- December 7 is locked to the date gift `Six months`.
- The remaining gifts are randomly distributed across the other dates.

Edit `app.js` to replace the placeholder gift text. Each category has a `gifts` array with four entries. Add a `url` field to any gift to make the reveal button open a song, photo album, map, or playlist. Add a `calendarUrl` field for normal calendar links, or an `appleCalendar` object to generate a downloadable `.ics` file for Apple Calendar.

The first browser that opens the page saves the shuffle in `localStorage`. Use the circular shuffle button in the top right to generate a new shuffle while preserving the locked dates.


## Apple Calendar events

For Apple Calendar, add an `appleCalendar` object to a date gift in `app.js`:

```js
appleCalendar: {
  title: "Pottery atelier",
  start: "2026-12-18T19:00:00+01:00",
  end: "2026-12-18T21:00:00+01:00",
  location: "Studio name or address",
  description: "Pottery atelier together"
}
```

The reveal will show an `Add to Apple Calendar` button that downloads an `.ics` file.
