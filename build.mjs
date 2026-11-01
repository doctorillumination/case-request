import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const data = JSON.parse(await readFile(new URL('./budget.json', import.meta.url), 'utf8'));
const money = cents => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(cents / 100);
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const link = (url, label) => `<a href="${escape(url)}">${escape(label)} <span aria-hidden="true">↗</span></a>`;
const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.unitCents, 0);
const gst = Math.round(subtotal * data.gstPercent / 100);
const pst = Math.round(subtotal * data.pstPercent / 100);
const total = subtotal + gst + pst;
const gap = total - data.budgetCents;
const item = row => data.items.find(entry => entry.sourceRow === row);

const descriptions = {
  16: {
    title: 'Microsoft Surface Laptop Ultra', spec: 'NVIDIA RTX Spark N1X · 20-core CPU / 6,144-core GPU · 128GB unified memory · 1TB SSD',
    purpose: 'A portable computer for local large language model (LLM) development, running and testing models on the classroom network.',
    note: 'Full-core configuration in Nightfall, with an English keyboard and Windows 11 Pro. Microsoft Canada price checked 1 November 2026, without trade-in credit or optional protection. Uses its built-in display, keyboard, and trackpad.'
  },
  17: {
    title: 'Apple Mac Studio', spec: 'M5 Max · 18-core CPU / 40-core GPU · 128GB memory · 2TB storage',
    purpose: 'A high-memory workstation for local large language model (LLM) development, running and testing models on Apple silicon.',
    note: 'Apple education price benchmark; school quote required. Includes one of the four new displays and a separately budgeted keyboard and mouse.'
  },
  18: {
    title: 'Apple Mac mini', spec: 'M6 · 12-core CPU / 12-core GPU · 32GB memory · 1TB storage',
    purpose: 'Three student workstations for iPhone app development with Xcode, including building and testing apps in the iPhone simulator.',
    note: 'Apple education price benchmark; school quote required. Standard 2.5Gb Ethernet. Each mini receives a new display and a keyboard and mouse.'
  },
  19: {
    title: 'Dell 27-inch 4K monitors', spec: 'S2725QC · USB-C · 120Hz · height-adjustable IPS display',
    purpose: 'Four monitors, one for the Mac Studio and one for each of the three Mac minis.',
    note: 'Each has two built-in 5W speakers, so separate speakers are removed. Includes a USB-C cable and a USB hub for peripherals.'
  },
  20: {
    title: 'Logitech Pebble 2 keyboard and mouse', spec: 'Bluetooth combo · Tonal Rose listing',
    purpose: 'Four keyboard and mouse sets, one for the Mac Studio and one for each of the three Mac minis.',
    note: 'Each Mac has its own keyboard and mouse. The Surface Laptop Ultra uses its built-in keyboard and trackpad.'
  },
  21: {
    title: 'Logitech Brio 300 webcams', spec: '1080p · USB-C · Graphite',
    purpose: 'Two cameras for computer-vision experiments and video projects.',
    note: 'Privacy shutter and built-in backup microphone. Connects directly to a Mac mini USB-C port.'
  },
  22: {
    title: 'Logitech G Yeti Orb microphones', spec: 'USB microphone · White · desktop stand included',
    purpose: 'Two microphones for voice-based AI projects and audio recording.',
    note: 'Mac compatible. Includes a USB-C to USB-A cable; connects through the Dell monitor USB-A hub.'
  },
  25: {
    title: 'Kingston XS1000 external SSDs', spec: '2TB each · USB 3.2 Gen 2 · SXS1000/2000G',
    purpose: 'Two portable drives for AI models, project files, and media storage.',
    note: 'Up to 1050MB/s read. Includes a USB-C to USB-A cable for the Studio or Dell hub. A suitable 10Gbps USB-C cable is needed for a direct mini connection.'
  }
};

const rows = data.items.map(entry => {
  const copy = descriptions[entry.sourceRow];
  return `<tr>
    <td class="item-cell"><h3>${escape(copy.title)}</h3><p class="spec">${escape(copy.spec)}</p><p>${escape(copy.purpose)}</p><p class="item-note">${escape(copy.note)}</p><p class="purchase">${link(entry.url, `View at ${entry.seller}`)}</p></td>
    <td class="qty" data-label="Quantity">${entry.quantity}</td>
    <td class="number" data-label="Each">${money(entry.unitCents)}</td>
    <td class="number line-total" data-label="Line total">${money(entry.quantity * entry.unitCents)}</td>
  </tr>`;
}).join('\n');

const html = `<!doctype html>
<html lang="en-CA">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="360 AIX classroom hardware request for Shawnigan: five computers, four monitors for the Macs, project peripherals, costs, and purchase links.">
  <meta name="theme-color" content="#183b36">
  <title>360 AIX | Hardware request</title>
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="header-inner"><a class="brand" href="#"><span class="brand-mark" aria-hidden="true">360</span><span>AIX <span class="brand-divider">/</span> Shawnigan</span></a><span class="header-label">Hardware request</span></div>
  </header>
  <main id="main">
    <section class="intro" aria-labelledby="page-title">
      <p class="eyebrow">Classroom equipment · November 2026</p>
      <h1 id="page-title">360 AIX hardware request</h1>
      <p class="lead">A Mac Studio and Surface Laptop Ultra with NVIDIA RTX Spark for local large language model development, three Mac minis for iPhone development with Xcode, and four monitors for the Macs with shared project equipment.</p>
      <p class="date">Updated ${escape(data.revisionDate)}. All amounts in Canadian dollars.</p>
    </section>

    <section class="summary" aria-label="Budget at a glance">
      <div class="summary-main"><span class="metric-label">Total requested</span><strong>${money(total)}</strong><span>Including estimated tax</span></div>
      <div class="summary-detail"><span class="metric-label">Hardware budget</span><strong>${money(data.budgetCents)}</strong><span class="${gap > 0 ? 'over-budget' : 'within-budget'}">${money(Math.abs(gap))} ${gap > 0 ? 'above budget' : 'remaining in budget'}</span></div>
    </section>

    <nav class="section-nav" aria-label="On this page"><a href="#equipment">Equipment &amp; links</a><a href="#budget">Cost breakdown</a><a href="#purchasing">Purchasing notes</a></nav>

    <section id="equipment" aria-labelledby="equipment-title">
      <div class="section-heading"><div><p class="eyebrow">01 / Equipment</p><h2 id="equipment-title">What we’re requesting</h2></div><p>Unit and line prices are before tax.</p></div>
      <table class="equipment-table">
        <caption class="visually-hidden">Hardware purchase list, quantities, estimated prices and supplier links</caption>
        <thead><tr><th scope="col">Item &amp; classroom use</th><th scope="col" class="qty">Qty</th><th scope="col" class="number">Each</th><th scope="col" class="number">Line total</th></tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr><th scope="row" colspan="3">Hardware subtotal, before tax</th><td class="number">${money(subtotal)}</td></tr></tfoot>
      </table>
    </section>

    <section id="budget" class="budget-section" aria-labelledby="budget-title">
      <div><p class="eyebrow">02 / Budget</p><h2 id="budget-title">Cost breakdown</h2><p>Uses the workbook’s 5% GST and 7% BC PST assumptions, with no tax recovery assumed.</p></div>
      <dl class="cost-list">
        <div><dt>Hardware before tax</dt><dd>${money(subtotal)}</dd></div>
        <div><dt>GST (${data.gstPercent}%)</dt><dd>${money(gst)}</dd></div>
        <div><dt>BC PST (${data.pstPercent}%)</dt><dd>${money(pst)}</dd></div>
        <div class="cost-total"><dt>Total requested</dt><dd>${money(total)}</dd></div>
        <div><dt>Hardware budget</dt><dd>${money(data.budgetCents)}</dd></div>
        <div class="${gap > 0 ? 'cost-gap' : 'cost-remaining'}"><dt>${gap > 0 ? 'Additional funding required' : 'Budget remaining'}</dt><dd>${money(Math.abs(gap))}</dd></div>
      </dl>
    </section>

    <section id="purchasing" aria-labelledby="purchasing-title">
      <p class="eyebrow">03 / Purchasing</p><h2 id="purchasing-title">Notes for ordering</h2>
      <div class="notes-grid">
        <div><h3>School pricing</h3><p>Apple prices and configurations are the workbook’s public education benchmarks from ${escape(data.sourceDate)}. Obtain an institutional quote before ordering; the individual education store is not the school purchasing route.</p><p>${link('https://ecommerce.apple.com/asb2bstorefront/fys?country=CA&language=EN', 'Apple Education Institutions')}<br>${link('https://www.apple.com/ca/contact/', 'Apple purchasing contact')}<br>${link('https://www.apple.com/ca-edu/shop/help/policies', 'Apple education purchase policies')}</p></div>
        <div><h3>Connections &amp; setup</h3><p>Connect the four Mac displays with the included USB-C cables. Plug the Yeti microphones into the Dell USB-A hubs and the webcams directly into the minis.</p><p>Four keyboard and mouse sets equip the Mac Studio and three Mac minis. The Surface Laptop Ultra uses its built-in display, keyboard, and trackpad, and can connect to the existing classroom Wi-Fi for shared access.</p></div>
        <div><h3>Price &amp; availability</h3><p>The Surface Laptop Ultra configuration is listed at ${money(item(16).unitCents)} before tax in Microsoft Canada’s configurator, checked ${escape(item(16).priceCheckedDate)}. All other prices remain the workbook’s planning estimates from ${escape(data.sourceDate)}. Confirm prices, stock, shipping, and exact configurations with suppliers before ordering.</p><p>Dell’s built-in speakers were verified on 27 September 2026. ${link(item(19).url, 'Dell specifications')}</p><p>${link('https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate/calculator.html', 'GST and PST reference')}</p></div>
      </div>
    </section>

    <footer><p>360 AIX · Shawnigan · Hardware purchasing request</p><p>Based on the supplied hardware workbook, revised ${escape(data.sourceDate)}, with subsequent requested changes. Hardware quantities, Surface Laptop Ultra configuration, and budget updated ${escape(data.revisionDate)}.</p></footer>
  </main>
</body>
</html>`;

await writeFile(new URL('./index.html', import.meta.url), html);
const outputDirectory = new URL('./dist/', import.meta.url);
await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await writeFile(new URL('index.html', outputDirectory), html);
for (const asset of ['styles.css', 'favicon.svg']) {
  await copyFile(new URL(asset, import.meta.url), new URL(asset, outputDirectory));
}
console.log(JSON.stringify({ subtotal, gst, pst, total, gap }));
