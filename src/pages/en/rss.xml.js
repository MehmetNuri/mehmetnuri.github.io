import { buildFeed } from '../../lib/feed';

// İngilizce RSS beslemesi (/en/rss.xml)
export function GET(context) {
	return buildFeed('en', context.site);
}
