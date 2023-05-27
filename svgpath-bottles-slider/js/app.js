window.addEventListener('DOMContentLoaded', function () {
	/* 
	Znacenje OFFSET: the amount or distance by which something is out of line.

	The clientWidth property represents the inner width of an element in pixels, including padding but excluding borders, margins, and scrollbars. */

	let docWidth = document.body.clientWidth // tipa ako je ovo 500
	const wrap = document.querySelector('#wrap')
	const images = document.querySelectorAll('#wrap .block')
	let slidesWidth = wrap.clientWidth // sirina wrapera producta je onda 740
	let currentOffset = 0
	let targetOffset = 0 // this variable will be used to store the calculated offset of a target element based on the mouse position.
	let isAnimating = false

	// kad risajzujemo ponovo kupimo ove vrednosti
	window.addEventListener('resize', function () {
		docWidth = document.body.clientWidth
		slidesWidth = wrap.clientWidth
	})

	document.addEventListener('mousemove', function (e) {
		let mouseX = e.pageX // this e.pageX property represents the X-coordinate of the mouse pointer relative to the whole document.

		/*
		1. (mouseX / docWidth)
			calculates the ratio of the current mouse position to the document width.
			It gives a value between 0 and 1, representing the position of the mouse along the horizontal axis

		2. (mouseX / docWidth) * slidesWidth
			multiplies the ratio obtained in the previous step by the width of the wrap element.
			This calculates the position of the mouse within the wrap element.

		3. ((mouseX / docWidth) * slidesWidth - mouseX / 2)
			subtracts half of the current mouse position from the previous result.
			This adjustment centers the position around the mouse cursor, as the mouse pointer is at the center of the calculation.

		4. -1 * ((mouseX / docWidth) * slidesWidth - mouseX / 2)
			negates the value obtained in the previous step.
			This ensures that the offset is in the opposite direction of the mouse movement.
		*/
		targetOffset = -1 * ((mouseX / docWidth) * slidesWidth - mouseX / 2)

		if (!isAnimating) requestAnimationFrame(updateOffset)
		// console.log({ mouseX }, { targetOffset })
		// console.log(mouseX / docWidth)

		function updateOffset() {
			/* 
			The lerp() function stands for linear interpolation. It is a mathematical function commonly used in computer graphics and animation to smoothly interpolate between two values based on a parameter t that ranges between 0 and 1.

			Here is how the lerp() function works: 

			const lerp(a, b, t) => (1 - t) * a + t * b

			🅰️ a represents the starting value (currentOffset)
			🅱️ b represents the ending value (targetOffset)
			0️⃣-1️⃣ t represents the interpolation parameter that determines how much to interpolate between 🅰️ and 🅱️. It should be a value between 0️⃣ and 1️⃣ (0.075)

			lerp(currentOffset, targetOffset, 0.075) => (1 - 0.075) * currentOffset + 0.075 * targetOffset

			1. (1 - t) * a 
				When t is 0, this term evaluates to 🅰️ since (1 - 0) * a = a   tj (currentOffset)
				When t is 1, this term evaluates to 0️⃣ since (1 - 1) * a = 0. This term essentially determines the contribution of 🅰️ to the final interpolated value.

			2. t * b
				When t is 0, this term evaluates to 0️⃣ since 0 * b = 0.
				When t is 1, this term evaluates to 🅱️ since 1 * b = b. This term determines the contribution of 🅱️ to the final interpolated value.

			3. Adding the two terms together (1 - t) * a + t * b
				combines the weighted values of a and b to produce the interpolated value. As t transitions from 0 to 1, the interpolated value smoothly transitions from a to b in a linear fashion.

			In the context of your code, the line:
				currentOffset = lerp(currentOffset, targetOffset, 0.075)
			uses the lerp() function to update the currentOffset variable. It interpolates between the current value of currentOffset and the value of targetOffset using a t value of 0.075. This results in a gradual transition from the current offset to the target offset, creating a smooth animation effect. */
			isAnimating = true
			currentOffset = lerp(currentOffset, targetOffset, 0.075)

			/*
			In summary, this function checks if the absolute difference between currentOffset and targetOffset is less than 0.5. If it is, it updates currentOffset to match targetOffset and sets isAnimating to false. This condition is typically used to determine when an animation or transition has reached its desired endpoint, allowing subsequent actions or state changes to occur.  */
			if (Math.abs(currentOffset - targetOffset) < 0.5) {
				currentOffset = targetOffset
				isAnimating = false
			}

			// pomeramo slike levo, desno u zavisnosti od currentOffseta, tj gde nam je sad mis
			images.forEach((image) => (image.style.transform = `translate3d(${currentOffset}px, 0, 0)`))

			// images[2].style.transform = `translate3d(${currentOffset}px, 0, 0)`
			// images[5].style.transform = `translate3d(${currentOffset}px, 0, 0)`

			if (isAnimating) requestAnimationFrame(updateOffset)
		}

		function lerp(a, b, t) {
			return (1 - t) * a + t * b
		}
	})

	// console.log({docWidth}, {wrap}, {slidesWidth})
})

const tl = gsap.timeline({ paused: true })
let $path = document.querySelector('.path')

function showInfo() {
	revealDescription() // ovde kor ovo tl od gore

	const showBtn = document.getElementById('header__toggleOverlay')
	const closeBtn = document.getElementById('closeBtn')

	showBtn.addEventListener('click', function (e) {
		tl.reversed(!tl.reversed())
	})
	closeBtn.addEventListener('click', function (e) {
		tl.reversed(!tl.reversed())
	})
}
showInfo()

function revealDescription() {
	// d="M 0 100 V 100 Q 50 100 100 100 V 100 z"    ovo je D u html-u
	// razlika izmdju start o end path-a je samo ova dva 50 u start koja su 0 u end. IGRAJ SE SA SVIM OVIM VREDNOSTIMA
	let dChangableRadiusStart = 50 // u html-u, dakle inicijalno je ovo 100 (ravno), zato se dobija efekat takav, on iz 100 ide u 50 (polukrivo) pa 0 (ravno), pa posle reverse, iz 0 pa 50 pa 100 (ravno)
	let dChangableRadiusEnd = 0
	const start = `M 0 100 V ${dChangableRadiusStart} Q 50 0 100 ${dChangableRadiusStart} V 100 z`
	const end = `M 0 100 V ${dChangableRadiusEnd} Q 50 0 100 ${dChangableRadiusEnd} V 100 z`

	tl.to('.wines', {
		duration: 0.1,
		opacity: 1,
		ease: 'power2.inOut',
	})

	tl.to($path, { duration: 0.8, attr: { d: start }, ease: 'power3.in' })
	tl.to($path, { duration: 0.4, attr: { d: end }, ease: 'power3.out' }) // igraj se s ovim vrednostinam i probaj da zakomentarises itd

	tl.from('.block', {
		duration: 1,
		clipPath: 'inset(0 100% 0 0)',
		// clipPath: 'inset(100% 0 100% 0)',
		ease: 'power4.out',
		stagger: {
			amount: 0.25,
		},
	})

	tl.from('.product img', { duration: 1, scale: 3, ease: 'power4.out', stagger: { amount: 0.25 } }, '-=1.5')
	// tl.from('.product img', { duration: 1, scale: 0, opacity: 0, ease: 'power4.out', stagger: { amount: 0.25 } }, '-=1')

	// tl.from('#closeBtn', { duration: 1, opacity: 0, right: '-25%', ease: 'power2.inOut' }, '-=1').reverse()
	tl.from('#closeBtn', { duration: 1, opacity: 0, right: '-25%', ease: 'power2.inOut' }, '-=1')

	return tl.reverse()
}
