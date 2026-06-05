import { buildJsonFeed } from '../../lib/feed';

// İngilizce JSON Feed (/en/feed.json)
export function GET(context) {
	return buildJsonFeed('en', context.site);
}
