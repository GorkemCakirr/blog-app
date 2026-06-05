'use client';

export default function LeftNav({ headings, activeHeading, setActiveHeading }) {
  if (!headings || headings.length === 0) {
    return null;
  }

  const handleHeadingClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y });
      setActiveHeading(id);
    }
  };

  return (
    <div className='sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto'>
      <div className='px-2 py-4'>
        <h1 className='text-lg font-semibold'>On this page</h1>
      </div>
      <nav className='space-y-1'>
        {headings.map((heading) => (
          <div
            key={heading.id}
            style={{ marginLeft: `${(heading.level - 1) * 1}rem` }}
          >
            <button
              onClick={() => handleHeadingClick(heading.id)}
              className={`w-full text-left px-2 py-[6px] rounded-md text-md transition-colors
                ${
                  activeHeading === heading.id
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }
                ${heading.level === 1 ? 'font-semibold' : ''}
                ${heading.level === 3 ? 'font-light' : ''}
              `}
            >
              {heading.text}
            </button>
          </div>
        ))}
      </nav>
    </div>
  );
}
