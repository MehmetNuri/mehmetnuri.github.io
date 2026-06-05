import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

// Her yazının okuma süresini (dakika, sayı) frontmatter'a "minutesRead" olarak ekler.
// Dile göre biçimlendirme layout'ta yapılır.
export function remarkReadingTime() {
	return function (tree, { data }) {
		const textOnPage = toString(tree);
		const readingTime = getReadingTime(textOnPage);
		data.astro.frontmatter.minutesRead = Math.max(1, Math.round(readingTime.minutes));
	};
}
