import React from 'react';

const ELLIPSIS = '\u2026'; // Ellipsis character

export const ChipList = ({ chips = [], maxChips, maxTextLength }) => {
  if (!chips || chips.length === 0) {
    return <></>; // Return empty fragment if no chips are provided
  }

  // Limit the number of chips displayed
  const displayedChips = maxChips && maxChips > 0 ? chips.slice(0, maxChips) : chips;

  // Handle text truncation based on maxTextLength
  const truncateText = (text) => {
    if (maxTextLength && maxTextLength > 0 && text.length > maxTextLength) {
      return text.slice(0, maxTextLength) + ELLIPSIS;
    }
    return text;
  };

  return (
    <section style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      {displayedChips.map((chip, index) => (
        <div
          key={index}
          style={{
            border: '1px solid #bbbbbb',
            padding: '4px',
            borderRadius: '8px',
          }}
          data-testid={⁠ `chip-${index}` ⁠}'>'
          {truncateText(chip.label)}
        </div>
      ))}
      {/* Display remaining chip count */}
      {maxChips && maxChips < chips.length && (
        <aside data-testid="exceeding-text">
          {chips.length - maxChips} more items
        </aside>
      )}
    </section>
  );
};