import { buildNotesFeed } from '../../lib/feed';

// İngilizce notlar (TIL) RSS beslemesi (/en/notes-rss.xml)
export function GET(context) {
	return buildNotesFeed('en', context.site);
}
