import { buildJsonFeed } from '../lib/feed';

// Türkçe JSON Feed (/feed.json)
export function GET(context) {
	return buildJsonFeed('tr', context.site);
}
