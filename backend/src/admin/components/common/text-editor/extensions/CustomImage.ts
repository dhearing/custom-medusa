import Image from '@tiptap/extension-image'

const CustomImage = Image.extend({
  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: element => element.getAttribute('src'),
        renderHTML: attrs => ({ src: attrs.src }),
      },
      alt: {
        default: null,
        parseHTML: element => element.getAttribute('alt'),
        renderHTML: attrs => ({ alt: attrs.alt }),
      },
      title: {
        default: null,
        parseHTML: element => element.getAttribute('title'),
        renderHTML: attrs => ({ title: attrs.title }),
      },
      width: {
        default: '25%',
        parseHTML: element => {
          // First try to get width from the width attribute
          const widthAttr = element.getAttribute('width');
          if (widthAttr) {
            return widthAttr.includes('%') ? widthAttr : `${widthAttr}%`;
          }
          // Then try to get it from style
          const styleWidth = element.style.width;
          if (styleWidth) {
            return styleWidth.includes('%') ? styleWidth : styleWidth.replace(/[px]/g, '') + '%';
          }
          return '25%';
        },
        renderHTML: attrs => {
          const width = attrs.width || '25%';
          return { width: width.includes('%') ? width : `${width}%` };
        },
      },
      'data-float': {
        default: 'left',
        parseHTML: element => element.getAttribute('data-float'),
        renderHTML: attrs => ({ 'data-float': attrs['data-float'] || 'left' }),
      },
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attrs => {
          const width = attrs.width?.replace(/[^0-9]/g, '') || '25';
          const float = attrs['data-float'] || 'left';
          return {
            style: `
              display: inline-block;
              float: ${float};
              width: ${width}%;
              margin: ${float === 'left' ? '0.5em 1em 0.5em 0' : '0.5em 0 0.5em 1em'};
              shape-outside: margin-box;
              shape-margin: 1em;
              vertical-align: top;
            `
          };
        },
      },
      class: {
        default: 'editor-image',
        parseHTML: element => element.getAttribute('class'),
        renderHTML: () => ({ class: 'editor-image' }),
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', {
      ...HTMLAttributes,
      draggable: false,
    }];
  },

  group: 'inline',
  inline: true,
  draggable: true,
  selectable: true,
})

export default CustomImage 