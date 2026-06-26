// Site genelinde kullanılan global veriler.

export const SITE_TITLE = 'Mehmet Nuri Öztürk';
export const SITE_DESCRIPTION =
	'Mehmet Nuri Öztürk’ün kişisel blogu: kurumsal Java, Spring Boot, Quarkus, mikroservisler, DevOps ve sistem tasarımı üzerine Türkçe yazılar ve öğrendiklerimden notlar.';

// Yazar / kimlik
export const AUTHOR_NAME = 'Mehmet Nuri Öztürk';

// Sosyal / iletişim bağlantıları
export const GITHUB_URL = 'https://github.com/MehmetNuri';
export const EMAIL = 'devmehmetnuri@gmail.com';

// GitHub kullanıcı adı (Projeler sayfası repoları build-time çekerken kullanılır).
export const GITHUB_USERNAME = 'MehmetNuri';

// Diğer sosyal profiller (boş bırakılanlar atlanır). JSON-LD "sameAs" ve
// iletişim bağlantılarında kullanılır.
export const TWITTER_URL = ''; // 'https://x.com/kullaniciadi'
export const LINKEDIN_URL = 'https://www.linkedin.com/in/mehmetnuri';
export const MASTODON_URL = ''; // 'https://mastodon.social/@kullaniciadi'
export const STACKOVERFLOW_URL = ''; // 'https://stackoverflow.com/users/...'

// JSON-LD ve "sameAs" için sosyal profiller (boş olanlar atlanır)
export const SOCIAL_PROFILES: string[] = [
	GITHUB_URL,
	TWITTER_URL,
	LINKEDIN_URL,
	MASTODON_URL,
	STACKOVERFLOW_URL,
].filter(Boolean);

// E-E-A-T (uzmanlık sinyalleri) — JSON-LD Person ve yazar kutusunda kullanılır.
export const AUTHOR_JOB_TITLE = { tr: 'Yazılım Geliştirici', en: 'Software Developer' };
// Hakim olunan konular (Google'a konu otoritesi sinyali). Java odaklı.
export const AUTHOR_KNOWS_ABOUT: string[] = [
	'Java',
	'Spring',
	'Spring Boot',
	'Quarkus',
	'JVM',
	'Backend Geliştirme',
	'Mikroservisler',
	'Sistem Tasarımı',
	'DevOps',
	'CI/CD',
	'Podman',
	'Linux',
	'Python',
	'TypeScript',
	'Astro',
	'Web',
];

// Arama motoru site doğrulama meta etiketleri (boş → eklenmez).
// Google Search Console / Bing Webmaster Tools'tan alınan içerik değerleri.
export const VERIFICATION = {
	google: '', // google-site-verification içeriği
	bing: '', // msvalidate.01 içeriği
};

// Google Analytics 4 ölçüm kimliği (örn. 'G-XXXXXXXXXX').
// Boş bırakılırsa GA yüklenmez. Yalnızca production'da çalışır.
export const GA_MEASUREMENT_ID = '';

// FeelBack panelinden alınan "content set" kimliği (yazı altı beğeni/tepki).
// Boş bırakılırsa tepki widget'ı gösterilmez.
export const FEELBACK_CONTENT_SET_ID = '';

// Giscus (GitHub Discussions tabanlı yorumlar).
// https://giscus.app adresinden repoyu seçip değerleri al, Discussions'ı aç,
// giscus uygulamasını repoya kur. Boş bırakılırsa yorumlar gösterilmez.
export const GISCUS = {
	repo: '', // 'MehmetNuri/mehmetnuri.com'
	repoId: '',
	category: 'Announcements',
	categoryId: '',
};

// Gizlilik dostu analitik (GoatCounter). Yalnızca site kodunu gir (örn. 'mehmetnuri').
// https://www.goatcounter.com adresinden ücretsiz hesap aç. Boş → yüklenmez,
// yalnızca production'da çalışır. GA'ya hafif/çerezsiz bir alternatiftir.
export const GOATCOUNTER_CODE = '';

// E-posta bülteni (Buttondown). https://buttondown.com kullanıcı adını gir
// (örn. 'mehmetnuri'). Boş → abonelik formu gösterilmez.
export const NEWSLETTER = {
	provider: 'buttondown' as const,
	username: '', // 'mehmetnuri'
};

// Webmention.io ile gelen etkileşimleri (yanıt/beğeni/repost) yazıların altında
// göster. https://webmention.io adresine sitenle giriş yapıp domaini doğrula.
// domain: webmention.io'da kayıtlı alan adın (örn. 'mehmetnuri.com'). Boş → kapalı.
export const WEBMENTION = {
	domain: '', // 'mehmetnuri.com'
	// İsteğe bağlı: <link rel="webmention"> için özel uç nokta. Boş ise domain'den türetilir.
	endpoint: '',
};

// WakaTime kodlama istatistikleri (/uses sayfasında haftalık özet).
// API anahtarını GİZLİ tut — repoya yazma. Ortam değişkeniyle ver:
//   WAKATIME_API_KEY=... ./node_modules/.bin/astro build
// Anahtar yoksa widget sessizce gizlenir.
export const WAKATIME_USERNAME = ''; // 'current' veya kullanıcı adın (yalnızca profil linki için)
