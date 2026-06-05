import { buildNotesFeed } from '../lib/feed';

// Türkçe notlar (TIL) RSS beslemesi (/notes-rss.xml)
export function GET(context) {
	return buildNotesFeed('tr', context.site);
}
