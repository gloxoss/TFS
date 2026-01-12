---
description: Fix mouse wheel/trackpad scroll in modals and drawers
---

# Modal/Drawer Scroll Fix Pattern

When scroll works with scrollbar but NOT with mouse wheel or trackpad in modals/drawers, use this pattern:

## Step 1: Add Import
```tsx
import { useRef } from 'react'
```

## Step 2: Create Ref & Wheel Handler
```tsx
const contentRef = useRef<HTMLDivElement>(null)

const handleWheel = (e: React.WheelEvent) => {
  e.stopPropagation()
  if (contentRef.current) {
    contentRef.current.scrollTop += e.deltaY
    e.preventDefault()
  }
}
```

## Step 3: Apply to Scrollable Container
```tsx
<div 
  ref={contentRef}
  onWheel={handleWheel}
  className="flex-1 min-h-0 overflow-y-auto"
>
  {/* Scrollable content */}
</div>
```

## Required CSS Classes
| Class | Purpose |
|-------|---------|
| `flex-1` | Takes remaining space in flex container |
| `min-h-0` | **Critical** - allows flex item to shrink for scroll |
| `overflow-y-auto` | Enables vertical scrolling |

## Optional: Lock Background Page
```tsx
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
  return () => { document.body.style.overflow = '' }
}, [isOpen])
```

## Why It Works
- `stopPropagation()` prevents wheel event from bubbling to parent/page
- `preventDefault()` stops the default scroll behavior on page
- `min-h-0` is the hidden fix for flex container scroll issues
