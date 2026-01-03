# Implement Minimap

## Summary

Implement a Minimap overlay that sticks to the native scrollbar area to visualize search match positions. This feature aims to replicate the "find in page" experience where tick marks indicate match locations, but without hiding or replacing the native browser scrollbar to ensure zero layout shift. The ticks will be styled as distinct "squares".

## Motivation

Users rely on visual cues on the scrollbar to navigate search results. However, replacing the native scrollbar is risky as it can cause layout shifts (e.g., with `vw` units) and scroll jank. By keeping the native scrollbar and overlaying the match indicators (ticks), we preserve the native scrolling experience and layout stability while providing the necessary visual feedback.

## Change ID

`implement-minimap`
