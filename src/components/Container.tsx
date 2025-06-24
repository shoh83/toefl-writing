import React from 'react';

// This component wraps your page content.
// - `max-w-4xl`: Sets a maximum width to prevent the content from becoming too wide on large screens.
// - `mx-auto`: Automatically calculates the left and right margins to center the element.
// - `px-4 sm:px-6 lg:px-8`: Adds horizontal padding on the sides, which is responsive to screen size.
export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}
