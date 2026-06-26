One-liner: Gorda's primary action button in the Soft UI style — uppercase label, gradient fill, subtle lift on hover.

```jsx
<Button color="info" icon="fas fa-plus">New service</Button>
<Button color="primary" variant="outline" size="sm">Filter</Button>
<Button color="danger" rounded icon="fas fa-ban" />
```

Variants: `gradient` (default), `solid`, `outline`. Colors: primary, secondary, info, success, warning, danger, dark, light. Sizes: sm / md / lg. Use `rounded` for pill table-action buttons, `fullWidth` for form submits (the login button is `color="info" fullWidth`).
