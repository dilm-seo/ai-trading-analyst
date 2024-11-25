import { XMLParser } from 'fast-xml-parser';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  creator: string;
}

export const fetchForexNews = async (): Promise<NewsItem[]> => {
  try {
    // Use a CORS proxy to fetch the RSS feed
    const response = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent('https://www.forexlive.com/feed/news/'));
    const xmlData = await response.text();
    
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
    
    const result = parser.parse(xmlData);
    const items = result.rss.channel.item;
    
    return items.map((item: any) => ({
      title: item.title,
      link: item.link,
      pubDate: new Date(item.pubDate).toLocaleString(),
      description: item.description.replace(/<[^>]*>/g, ''), // Remove HTML tags
      creator: item['dc:creator']
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    throw new Error('Failed to fetch forex news');
  }
};