export function geminiResponseToJSON(input) {
  
  const lines = input.split('\n').filter((line) => line.trim() !== '');

  const result = {
    type: 'doc',
    content: [],
  };

  let currentList = null;

  for (let line of lines) {
    // Check for headings
    if (line.startsWith('## ')) {
      result.content.push({
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: line.replace(/^## /, '').trim() }],
      });
    } else if (line.startsWith('---')) {
      // Separator
      result.content.push({
        type: 'horizontalRule',
      });
    } else if (line.startsWith('* ')) {
      // List item
      if (!currentList) {
        currentList = {
          type: 'bulletList',
          content: [],
        };
        result.content.push(currentList);
      }
      currentList.content.push({
        type: 'listItem',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: line.replace(/^\* /, '').trim() }],
          },
        ],
      });
    } else if (line.startsWith('**') && line.endsWith('**')) {
      // Bold paragraph
      result.content.push({
        type: 'paragraph',
        content: [
          {
            type: 'text',
            marks: [{ type: 'bold' }],
            text: line.replace(/^\*\*/, '').replace(/\*\*$/, '').trim(),
          },
        ],
      });
    } else {
      // Regular paragraph
      if (currentList) {
        currentList = null; // End the current list
      }
      result.content.push({
        type: 'paragraph',
        content: [{ type: 'text', text: line.trim() }],
      });
    }
  }

  return result;
}
