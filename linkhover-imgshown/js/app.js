const innerTexts = document.querySelectorAll('.menu__item-innertext')
const menuItems = document.querySelectorAll('.menu__item')
const tl = gsap.timeline()

tl.set('.menu', { autoAlpha: 1 }) // nzm cemu ovo, mozda moze i bez ovog
tl.from('.menu__item-innertext', {
	delay: 1,
	duration: 1,
	xPercent: 100,
	yPercent: 125,
	stagger: 0.095,
	skewY: gsap.utils.wrap([-8, 8]),
	ease: 'expo.out',
})
tl.set('.menu', { pointerEvents: 'all' })

gsap.defaults({ duration: 0.55, ease: 'expo.out' })

menuItems.forEach((item) => {
	const imgWrapper = item.querySelector('.menu__item-image_wrapper')
	const imgWrapperBounds = imgWrapper.getBoundingClientRect()
	let itemBounds = item.getBoundingClientRect()

	// console.log(imgWrapperBounds)

	const onMouseEnter = () => {
		gsap.set(imgWrapper, { scale: 0.8, xPercent: 25, yPercent: 50, rotation: -15 })
		gsap.to(imgWrapper, { opacity: 1, scale: 1, xPercent: 0, yPercent: 0, rotation: 0 })
	}

	const onMouseLeave = () => {
		gsap.to(imgWrapper, { opacity: 0, scale: 0.8, xPercent: 25, yPercent: 50, rotation: -15 })
	}

	const onMouseMove = ({ x, y }) => {
		/* 
		mapRange(inMin, inMax, outMin, outMax, valueToMap)

			inMin : Number - The lower bound of the initial range to map from
			inMax : Number - The upper bound of the initial range to map from
			outMin : Number - The lower bound of the range to map to
			outMax : Number - The upper bound of the range to map to
			valueToMap : Number - The value that should be mapped (typically it's between inMin and inMax).
			Returns: the mapped number
			
			yOffset je promenljiva koja predstavlja dinamičnu vertikalnu korekciju koja se primenjuje na element imageWrapper tokom animacije. Računa se na osnovu odnosa top pozicije pravougaonika itemBounds i visine pravougaonika imgWrapperBounds.

			Naredni red koda koristi funkciju gsap.utils.mapRange za preslikavanje vrednosti yOffset iz raspona od 0 do 1.5 (očekivani raspon vrednosti yOffset) u novi raspon od -150 do 150. Ovo preslikavanje omogućava prilagođavanje vertikalne pozicije elementa imageWrapper unutar elementa item na osnovu pokreta miša i vrednosti yOffset.

			Sveukupno, ove računice osiguravaju da se element imageWrapper animira unutar elementa item i da reaguje na pokrete miša na vizuelno privlačan način.

			------
			
			x: Subtracting itemBounds.left ensures that the animation starts at the left edge of the item element.
			Additionally, imageWrapperBounds.width is divided by 1.55 and subtracted from the above difference. This adjustment helps position the imageWrapper element within the item element by offsetting it horizontally. Dividing the width by 1.55 likely provides a scaling factor to adjust the final position precisely.

			y:  Subtracting itemBounds.top ensures that the animation starts at the top edge of the item element.. Dividing the height by 2 centers the element vertically, while subtracting yOffset further adjusts the position based on the calculated yOffset value.
		*/

		let yOffset = itemBounds.top / imgWrapperBounds.height
		yOffset = gsap.utils.mapRange(0, 1.5, -150, 150, yOffset)
		gsap.to(imgWrapper, {
			duration: 1.25,
			x: Math.abs(x - itemBounds.left) - imgWrapperBounds.width / 1.55,
			y: Math.abs(y - itemBounds.top) - imgWrapperBounds.height / 2 - yOffset,
		})

		console.log(`x: ${Math.abs(x - itemBounds.left) - imgWrapperBounds.width / 0.55}`)
		console.log(`y: ${Math.abs(y - itemBounds.top) - imgWrapperBounds.height / 2 - yOffset}`)
	}

	item.addEventListener('mouseenter', onMouseEnter)
	item.addEventListener('mouseleave', onMouseLeave)
	item.addEventListener('mousemove', onMouseMove)

	window.addEventListener('resize', () => {
		itemBounds = item.getBoundingClientRect()
	})
})
