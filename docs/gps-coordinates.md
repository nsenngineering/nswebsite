# GPS Coordinates Guide

**How to find accurate GPS coordinates for projects**

---

## Why GPS Coordinates Matter

GPS coordinates place your projects on the interactive map, allowing clients to:
- See project locations visually
- Understand geographic distribution
- Click markers to view project details

**Coordinate Format:** Decimal degrees (e.g., `27.7172, 85.3240`)

---

## Valid Coordinate Range for Nepal

All projects must be within Nepal's boundaries:

- **Latitude:** `26.3°N` to `30.4°N`
- **Longitude:** `80.1°E` to `88.2°E`

**The build system will reject coordinates outside this range.**

---

## Method 1: Google Maps (Recommended)

**Best for:** Known locations, specific sites

### Step-by-Step Instructions

1. **Open Google Maps**
   - Go to [maps.google.com](https://maps.google.com)

2. **Find the Location**
   - **Option A:** Search for the location name
     - Type: "Kathmandu Valley" or "Rasuwa District"
     - Press Enter

   - **Option B:** Navigate manually
     - Zoom in to the area
     - Use satellite view for accuracy

3. **Get Coordinates**
   - **Desktop:** Right-click on the exact spot → Click "What's here?"
   - **Mobile:** Long-press on the location

4. **Copy Coordinates**
   - Coordinates appear at the bottom (desktop) or top (mobile)
   - Format: `27.7172, 85.3240`
   - First number = Latitude
   - Second number = Longitude

5. **Verify**
   - Latitude should be between 26 and 31
   - Longitude should be between 80 and 89
   - If not, coordinates are outside Nepal!

### Visual Guide

```
Google Maps → Right-click → "What's here?"
             ↓
         27.7172, 85.3240
             ↓
    Copy to CSV (separate into two columns)
    coordinates_lat: 27.7172
    coordinates_lng: 85.3240
```

---

## Method 2: LatLong.net

**Best for:** Quick lookups, address search

### Instructions

1. Go to [LatLong.net](https://www.latlong.net/)
2. Enter location in search box:
   - City: "Pokhara"
   - District: "Gorkha District"
   - Landmark: "Tribhuvan International Airport"
3. Click "Find"
4. Copy the coordinates shown
   - Latitude: `27.7172`
   - Longitude: `85.3240`

---

## Method 3: GPS Visualizer

**Best for:** Batch conversions, multiple locations

### Instructions

1. Go to [GPSVisualizer.com](https://www.gpsvisualizer.com/geocoder/)
2. Enter location names (one per line)
3. Click "Start geocoding"
4. Download results as CSV
5. Extract latitude and longitude columns

---

## What If You Don't Know the Exact Location?

### Use Approximate Coordinates

It's okay to use approximate locations. You can:

1. **Use District Headquarters**
   - Example: "Upper Tamor Project" → Use Taplejung HQ coordinates

2. **Use City Center**
   - Example: "Kathmandu Valley Project" → Use Kathmandu center

3. **Use Midpoint for Linear Projects**
   - Example: "Mugling-Pokhara Highway" → Use midpoint between cities

### District Headquarters Reference

Here are coordinates for major district headquarters in Nepal:

| District | HQ City | Latitude | Longitude |
|----------|---------|----------|-----------|
| Kathmandu | Kathmandu | 27.7172 | 85.3240 |
| Lalitpur | Lalitpur | 27.6688 | 85.3247 |
| Bhaktapur | Bhaktapur | 27.6720 | 85.4298 |
| Pokhara | Pokhara | 28.2096 | 83.9856 |
| Chitwan | Bharatpur | 27.6786 | 84.4360 |
| Dhading | Dhading Besi | 27.8667 | 84.9000 |
| Gorkha | Gorkha | 28.2667 | 84.6333 |
| Rasuwa | Dhunche | 28.1167 | 85.3000 |
| Sindhupalchok | Chautara | 27.8333 | 85.5667 |
| Nuwakot | Bidur | 27.9167 | 85.1667 |
| Makwanpur | Hetauda | 27.4286 | 85.0325 |
| Bara | Kalaiya | 27.0333 | 84.9167 |
| Rupandehi | Butwal | 27.7000 | 83.4667 |
| Kaski | Pokhara | 28.2096 | 83.9856 |
| Tanahun | Damauli | 27.9500 | 84.2833 |
| Syangja | Putalibazar | 28.0667 | 83.8667 |
| Parbat | Kusma | 28.2167 | 83.6833 |
| Baglung | Baglung | 28.2667 | 83.5833 |
| Myagdi | Beni | 28.3678 | 83.6053 |
| Mustang | Jomsom | 28.7833 | 83.7333 |
| Manang | Chame | 28.5500 | 84.2333 |
| Lamjung | Besisahar | 28.2333 | 84.4333 |
| Jajarkot | Khalanga | 28.8947 | 82.1908 |
| Dailekh | Dailekh | 28.8500 | 81.7167 |
| Surkhet | Birendranagar | 28.6012 | 81.6234 |
| Banke | Nepalgunj | 28.0500 | 81.6167 |
| Dang | Ghorahi | 28.0333 | 82.5000 |
| Kanchanpur | Mahendranagar | 28.8384 | 80.5534 |
| Kailali | Dhangadhi | 28.6947 | 80.5842 |
| Doti | Dipayal | 29.2667 | 80.9333 |
| Achham | Mangalsen | 29.0833 | 81.2000 |
| Dadeldhura | Dadeldhura | 29.3000 | 80.5833 |
| Baitadi | Baitadi | 29.5333 | 80.5667 |
| Darchula | Darchula | 29.8500 | 80.5500 |
| Morang | Biratnagar | 26.4831 | 87.2800 |
| Jhapa | Chandragadhi | 26.6589 | 87.8719 |
| Ilam | Ilam | 26.9090 | 87.9258 |
| Panchthar | Phidim | 27.1500 | 87.7500 |
| Taplejung | Taplejung | 27.3456 | 87.6543 |
| Sankhuwasabha | Khandbari | 27.3500 | 87.2167 |
| Solukhumbu | Salleri | 27.5234 | 86.7123 |
| Dhankuta | Dhankuta | 27.0456 | 87.3421 |
| Terhathum | Myanglung | 27.1167 | 87.4500 |
| Bhojpur | Bhojpur | 27.1667 | 87.0500 |
| Okhaldhunga | Siddhicharan | 27.3167 | 86.5000 |
| Khotang | Diktel | 27.1500 | 86.7833 |
| Udayapur | Gaighat | 26.8500 | 86.7167 |
| Saptari | Rajbiraj | 26.5400 | 86.7500 |
| Siraha | Siraha | 26.6533 | 86.2108 |
| Dhanusha | Janakpur | 26.7288 | 85.9244 |
| Mahottari | Jaleshwar | 26.6425 | 85.7972 |
| Sarlahi | Malangwa | 26.9234 | 85.5678 |
| Rautahat | Gaur | 26.7667 | 85.2667 |
| Parsa | Birgunj | 27.0000 | 84.8667 |
| Nawalparasi | Kawasoti | 27.6431 | 83.9453 |
| Gulmi | Tamghas | 28.0833 | 83.2833 |
| Arghakhanchi | Sandhikharka | 27.9667 | 83.0000 |
| Palpa | Tansen | 27.8667 | 83.5500 |
| Kapilvastu | Taulihawa | 27.5667 | 83.0500 |
| Dang | Tulsipur | 28.1333 | 82.2833 |
| Pyuthan | Pyuthan | 28.1000 | 82.9167 |
| Rolpa | Liwang | 28.3667 | 82.7167 |
| Rukum | Musikot | 28.6000 | 82.5667 |
| Salyan | Salyan | 28.3667 | 82.1667 |
| Dolpa | Dunai | 28.9667 | 82.9000 |
| Jumla | Jumla | 29.2833 | 82.1833 |
| Kalikot | Manma | 29.3333 | 81.7333 |
| Mugu | Gamgadhi | 29.6833 | 82.0833 |
| Humla | Simikot | 29.9667 | 81.8167 |
| Bajura | Martadi | 29.5167 | 81.1833 |
| Bajhang | Chainpur | 29.5500 | 81.2167 |

---

## Converting Coordinates

### From Degrees/Minutes/Seconds to Decimal

If you have coordinates in this format: `27° 43' 6.192" N, 85° 19' 26.4" E`

**Manual Conversion:**
1. Degrees + (Minutes / 60) + (Seconds / 3600)
2. Example: 27 + (43/60) + (6.192/3600) = 27.7172

**Online Tools:**
- [FCC DMS to Decimal Converter](https://www.fcc.gov/media/radio/dms-decimal)
- [Calculate.net Coordinate Converter](https://www.calculateme.com/gps/gps-coordinates-converter/)

### From Different Coordinate Systems

If coordinates are in UTM, MGRS, or other systems:
- Use [Coordinates Converter](https://www.engineeringtoolbox.com/utm-latitude-longitude-d_1370.html)
- Or ask for decimal degree coordinates

---

## Validating Coordinates

### Quick Visual Check

1. **Copy coordinates:** `27.7172, 85.3240`
2. **Paste into Google Maps search bar**
3. **Check if marker appears in Nepal**
4. **Verify it's the correct location**

### Automated Validation

The build system checks:
- ✅ Latitude is between 26.3 and 30.4
- ✅ Longitude is between 80.1 and 88.2
- ✅ Both are valid numbers (not text)

If validation fails, you'll see an error like:
```
❌ Invalid latitude 35.5 for project: example-project
   Valid range for Nepal: 26.3°N to 30.4°N
```

---

## Tips & Best Practices

### ✅ Do's

- ✅ Use 4-6 decimal places for accuracy (e.g., `27.7172`)
- ✅ Double-check coordinates by pasting into Google Maps
- ✅ Use decimal format (not degrees/minutes/seconds)
- ✅ Document where you got coordinates (comment in CSV or notes)
- ✅ Use district centers if exact location unknown
- ✅ Verify marker appears in correct location on map

### ❌ Don'ts

- ❌ Don't use coordinates outside Nepal (26-31°N, 80-89°E)
- ❌ Don't swap latitude and longitude (lat comes first)
- ❌ Don't use text like "N" or "E" - just numbers
- ❌ Don't use commas for decimal points (use `.` not `,`)
- ❌ Don't guess wildly - use district center if unsure
- ❌ Don't copy coordinates from random sources without verifying

---

## Common Coordinate Formats

### ✅ Correct Format (Decimal Degrees)
```
Latitude: 27.7172
Longitude: 85.3240
```

### ❌ Wrong Formats

**Degrees/Minutes/Seconds:**
```
❌ 27° 43' 6.192" N, 85° 19' 26.4" E
```
Convert to decimal first!

**With Direction Letters:**
```
❌ 27.7172 N, 85.3240 E
```
Remove the N and E!

**Swapped Order:**
```
❌ 85.3240, 27.7172  (longitude first)
```
Latitude always comes first!

**Comma Decimal Separator:**
```
❌ 27,7172 / 85,3240  (European format)
```
Use period (`.`) not comma!

---

## Examples: Real Projects

### Example 1: Urban Project

**Project:** France Embassy NDT, Kathmandu
**Method:** Google Maps search
**Steps:**
1. Search: "France Embassy Lazimpath Kathmandu"
2. Right-click on building
3. "What's here?" → `27.7172, 85.3240`
4. CSV: `coordinates_lat: 27.7172, coordinates_lng: 85.3240`

### Example 2: Hydropower Project

**Project:** Upper Trishuli HEP, Rasuwa
**Method:** District headquarters (approximate)
**Steps:**
1. Project in Rasuwa District
2. Use Dhunche (district HQ) coordinates
3. Google Maps: "Dhunche, Rasuwa"
4. Coordinates: `28.1167, 85.3000`
5. CSV: `coordinates_lat: 28.1167, coordinates_lng: 85.3000`

### Example 3: Linear Project (Highway)

**Project:** Mugling-Pokhara Highway
**Method:** Midpoint calculation
**Steps:**
1. Mugling: `27.9333, 84.5667`
2. Pokhara: `28.2096, 83.9856`
3. Midpoint: `28.0715, 84.2762` (average of both)
4. CSV: `coordinates_lat: 28.0715, coordinates_lng: 84.2762`

Or use approximate: Pick major city along route (e.g., Damauli)

### Example 4: Transmission Line

**Project:** Kohalpur-Surkhet 400KV Line
**Method:** Use one endpoint
**Steps:**
1. Project connects Kohalpur to Surkhet
2. Use Surkhet (larger city) as reference
3. Birendranagar, Surkhet: `28.6012, 81.6234`
4. CSV: `coordinates_lat: 28.6012, coordinates_lng: 81.6234`

---

## Frequently Asked Questions

**Q: Do coordinates need to be exact?**
A: No, approximate is fine. Use district/city centers if exact location is unknown.

**Q: How many decimal places?**
A: 4-6 decimal places is good. More precision isn't necessary.

**Q: What if project spans multiple locations?**
A: Choose the main site, project office, or geographic center.

**Q: Can I use "0, 0" temporarily?**
A: No! This is in the Atlantic Ocean. Use a valid Nepal coordinate instead.

**Q: What if coordinates are wrong after publishing?**
A: Just update the CSV and rebuild - it's easy to fix!

**Q: How do I find coordinates for a road/highway?**
A: Use the midpoint, or a major city/landmark along the route.

---

## Coordinate Resources

**Tools:**
- [Google Maps](https://maps.google.com) - Best for most cases
- [LatLong.net](https://www.latlong.net/) - Quick lookups
- [GPS Visualizer](https://www.gpsvisualizer.com/) - Batch processing
- [GPS Coordinates](https://gps-coordinates.org/) - Simple interface

**Nepal-Specific:**
- [Nepal Map](https://www.openstreetmap.org/#map=7/28.394/84.124) - OpenStreetMap view
- District headquarters list (see table above)

**Converters:**
- [FCC DMS Converter](https://www.fcc.gov/media/radio/dms-decimal)
- [Calculate.net Converter](https://www.calculateme.com/gps/gps-coordinates-converter/)

---

## Quick Reference Card

```
┌─────────────────────────────────────┐
│  GPS Coordinates Quick Reference    │
├─────────────────────────────────────┤
│  Nepal Valid Range:                 │
│    Lat:  26.3°N to 30.4°N          │
│    Lng:  80.1°E to 88.2°E          │
├─────────────────────────────────────┤
│  Format: Decimal Degrees            │
│    Example: 27.7172, 85.3240       │
│    Order: Latitude, Longitude       │
├─────────────────────────────────────┤
│  Find Coordinates:                  │
│    1. Google Maps                   │
│    2. Right-click location          │
│    3. "What's here?"                │
│    4. Copy numbers                  │
├─────────────────────────────────────┤
│  In CSV:                            │
│    coordinates_lat: 27.7172         │
│    coordinates_lng: 85.3240         │
└─────────────────────────────────────┘
```

---

**Last Updated:** 2025-11-28
**Version:** 1.0.0
