interface CSVExportData {
  title: string;
  description: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string;
  seoTags: string;
  createdAt: string;
}

export const exportToCSV = (descriptions: any[], filename: string = 'seo-snap-descriptions') => {
  // Prepare data for CSV
  const csvData: CSVExportData[] = descriptions.map(desc => ({
    title: desc.title,
    description: desc.text.replace(/\n/g, ' '), // Remove line breaks for CSV
    seoTitle: desc.seoMetadata.title,
    metaDescription: desc.seoMetadata.description,
    keywords: desc.keywords.join(', '),
    seoTags: desc.seoMetadata.tags.join(', '),
    createdAt: new Date(desc.createdAt).toLocaleDateString()
  }));

  // Create CSV headers
  const headers = [
    'Product Title',
    'Description',
    'SEO Title',
    'Meta Description', 
    'Keywords',
    'SEO Tags',
    'Created Date'
  ];

  // Convert to CSV format
  const csvContent = [
    headers.join(','),
    ...csvData.map(row => [
      `"${row.title.replace(/"/g, '""')}"`,
      `"${row.description.replace(/"/g, '""')}"`,
      `"${row.seoTitle.replace(/"/g, '""')}"`,
      `"${row.metaDescription.replace(/"/g, '""')}"`,
      `"${row.keywords.replace(/"/g, '""')}"`,
      `"${row.seoTags.replace(/"/g, '""')}"`,
      `"${row.createdAt}"`
    ].join(','))
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportSingleDescriptionToCSV = (description: any, filename?: string) => {
  exportToCSV([description], filename || `product-${description.title.toLowerCase().replace(/\s+/g, '-')}`);
};