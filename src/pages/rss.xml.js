import { buildFeed } from '../lib/feed';

// Türkçe RSS beslemesi (/rss.xml)
export function GET(context) {
	return buildFeed('tr', context.site);
}
