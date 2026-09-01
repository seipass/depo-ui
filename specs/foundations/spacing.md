# Spacing, sizing, and shape

The Reference spacing scale uses a 4px base unit. The 2px hairline value is reserved for focus separation and fine visual detail; it is not a general layout step.

Semantic spacing roles are the public contract:

- control inline, control block, and control group for interactive controls;
- layout page, layout section, and layout panel for page composition;
- stack xs/sm/md/lg for vertical rhythm.

Controls expose semantic small, medium, large, and touch target sizes. Visual height and pointer hit target are separate concerns. Touch density must provide at least the target size required by the accessibility contract without forcing every visual control to become oversized.

Radius and border width are semantic aliases. Components do not invent arbitrary radius or border values. Elevation is a semantic surface role and must be paired with surface/border hierarchy so a shadowless or forced-colors environment remains understandable.
