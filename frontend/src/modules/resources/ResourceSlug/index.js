import parse, { domToReact } from 'html-react-parser';

const ResourceSlug = ({ content }) => {
	const parseStyle = (styleString) => {
		const styleObject = {};
		styleString.split(';').forEach(style => {
			if (style) {
				const [property, value] = style.split(':');
				styleObject[property.trim()] = value.trim();
			}
		});
		return styleObject;
	};

	const options = {
		replace: ({ attribs, children, name }) => {
		
			if (children) {
				children.forEach((child) => {
					if (child?.name == 'img' && child?.attribs?.src) {
						const urlFix = child.attribs.src.split("http://localhost:1337/")[1]
						child.attribs.src = `https://strapi.oeveo.com/${urlFix}`
						child.attribs.srcset = ''
					}
				})
			}

			if (!name || !attribs) {
				return
			}
			if (name === 'strong') {
				return <strong className='font-semibold'>{domToReact(children)}</strong>
			}
			if (name === 'h1') {
				return <h1 className='pb-1 pl-1 text-primary text-center text-3xl font-medium mb-2'>{domToReact(children)}</h1>
			}
			if (name === 'h2') {
				return <h2 className='pb-1 pl-1 text-primary text-2xl font-medium mb-2'>{domToReact(children)}</h2>
			}
			if (name === 'h3') {
				return <h2 className='pb-1 pl-1 text-primary text-xl font-medium'>{domToReact(children)}</h2>
			}
			if (name === 'h4') {
				return <h2 className='pb-1 pl-1 text-primary text-lg'>{domToReact(children)}</h2>
			}
			if (name === 'h5') {
				return <h2 className='pb-1 pl-1 text-primary text-base'>{domToReact(children)}</h2>
			}
			if (name === 'li') {
				return <li className='list-disc list-inside'>{domToReact(children)}</li>
			}
			if (name === 'hr') {
				return <div className="divider"></div>
			}
			if (name === 'a') {
				return <a className='text-hover' href={attribs.href}>{domToReact(children)}</a>
			}
			if (name === 'figure') {

				if (attribs.class.includes('image-style-align-right')) {
					return (
						<figure className='float-right mb-3 ml-3' style={parseStyle(attribs.style)}>
							{domToReact(children)}
						</figure>
					)
				} else if (attribs.class.includes('image-style-align-left')) {
					return (
						<figure className='float-left mb-3 mr-3' style={parseStyle(attribs.style)}>
							{domToReact(children)}
						</figure>
					)
				}
				if (attribs.class === 'image image_resized') {
					return (
						<div className="flex w-full justify-center my-10">
							<figure style={parseStyle(attribs.style)}>
								{domToReact(children)}
							</figure>
						</div>
					)
				}
				if (attribs.class === 'image') {
					return (
						<figure className="flex w-full justify-center my-10">
							{domToReact(children)}
						</figure>
					)
				}
				if (attribs.class === 'table') {
					return (
						<div className="flex w-full justify-center mb-3">
							<figure className='flex justify-center w-full'>
								{domToReact(children)}
							</figure>
						</div>
					)
				}
			}
			if (name === 'img') {
				return (
					<img
						src={attribs.src}
						alt={attribs.alt}
						style={{ objectFit: "scale-down" }}
					/>
				)
			}
		}
	}

	const post = parse(content, options)

	return (
		post
	)

}

export default ResourceSlug