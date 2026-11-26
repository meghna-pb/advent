# Advent planning checklist

## Buy

Snacks:
- Favorite snack
- One sweet snack
- One salty snack
- Bakery treat or pastry

Objects / physical gifts:
- One small token or symbolic object
- One useful object she will actually use
- One cozy object
- One desk / bag / keys / bedside object

Date-related items:
- Cine-concert tickets or booking confirmation for 4 December
- Six-month anniversary plan for 7 December
- Any reservation, transport, printed ticket, small card, or flowers needed for those dates

## Prepare in advance

Notes:
- Write 4 notes for the `words` category in `app.js`.

Photos:
- Put photo files in `assets/photos/`.
- Add an `image` field to the relevant photo gift in `app.js`, for example:
  `image: "assets/photos/photo-01.jpg"`

Songs:
- Copy the Spotify share link.
- Add it as a `url` field to the relevant song gift in `app.js`.

Date locking:
- Gifts are randomly assigned to dates unless the date is listed in `LOCKED_DAYS`.
- December 4 is already locked to `dates` gift 0: Cine-concert.
- December 7 is already locked to `dates` gift 1: Six months.
- To force another date to use a specific gift, add it to `LOCKED_DAYS` in `app.js`.

