const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({ size: 'A4', margin: 40 });
const outputPath = path.join(__dirname, 'project-summary.pdf');
const stream = fs.createWriteStream(outputPath);

doc.pipe(stream);

// Title
doc.fontSize(24).font('Helvetica-Bold').text('MindMatch', { align: 'center' });
doc.fontSize(14).font('Helvetica').text('сэтгэл зүйнд суурилсан ажил хайх платформ', { align: 'center' });
doc.moveDown(0.5);
doc.fontSize(10).text('Setgelzui Hiring Platform', { align: 'center', color: '#666666' });
doc.moveDown(1);

// Overview Section
doc.fontSize(14).font('Helvetica-Bold').text('📋 Төслийн Тойм');
doc.fontSize(11).font('Helvetica').text(
  'MindMatch нь Big Five (OCEAN) зан чанарын сэтгэл судлалд тулгуурлан ажил хайгч болон ажил олгогчдыг оновчтой нийцүүлдэг платформ юм.',
  { align: 'justify', lineGap: 8 }
);
doc.moveDown(0.5);

// Technology Stack
doc.fontSize(12).font('Helvetica-Bold').text('🔧 Технологийн Суурь');
doc.fontSize(10).font('Helvetica');
doc.text('Frontend: Next.js 16 + React 19 + TypeScript + Tailwind CSS', { lineGap: 5 });
doc.text('Backend: Next.js API Routes (Fullstack)', { lineGap: 5 });
doc.text('Database: MySQL + Prisma ORM', { lineGap: 5 });
doc.text('Authentication: NextAuth.js v4 (JWT)', { lineGap: 5 });
doc.text('AI: Groq — Llama 3.3 70B', { lineGap: 5 });
doc.moveDown(0.5);

// Key Features
doc.fontSize(12).font('Helvetica-Bold').text('✨ Гол Функцүүд');
doc.fontSize(10).font('Helvetica');
doc.text('✓ Big Five сэтгэл судлалын үнэлгээ', { lineGap: 5 });
doc.text('✓ Ажил хайгч ба ажил олгогчийн нэгдмэл платформ', { lineGap: 5 });
doc.text('✓ AI-ээр дамжуулсан асаа даалгавар үнэлгээ', { lineGap: 5 });
doc.text('✓ PDF CV-ний хэмжээтэй жинлэлт', { lineGap: 5 });
doc.text('✓ Нийцэлтийн скор үнэлгээ', { lineGap: 5 });
doc.text('✓ Баланс асуултын систем', { lineGap: 5 });
doc.moveDown(0.5);

// Project Structure
doc.fontSize(12).font('Helvetica-Bold').text('📁 Төслийн Бүтэц');
doc.fontSize(9).font('Helvetica');
doc.text('src/app/           - Next.js эхлүүлэх (страницууд, API routes)', { lineGap: 4 });
doc.text('src/components/    - React компонентууд (Navbar, Drawers, Widgets)', { lineGap: 4 });
doc.text('src/lib/           - Туслагч функцууд (auth, database, AI)', { lineGap: 4 });
doc.text('src/context/       - React Context (AI Drawer state)', { lineGap: 4 });
doc.text('prisma/            - ORM загвар, миграци, seed өгөгдөл', { lineGap: 4 });
doc.text('public/uploads/    -CV файлын сорилго', { lineGap: 4 });
doc.moveDown(0.5);

// API Endpoints
doc.fontSize(12).font('Helvetica-Bold').text('🌐 API Endpoints');
doc.fontSize(9).font('Helvetica');
doc.text('POST /api/auth/register         - Бүртгүүлэх', { lineGap: 4 });
doc.text('POST /api/auth/login            - Нэвтрэх (NextAuth)', { lineGap: 4 });
doc.text('GET/POST /api/jobs              - Ажлын жагсаалт/нийтлэл', { lineGap: 4 });
doc.text('POST /api/applications          - Өргөдөл илгээх', { lineGap: 4 });
doc.text('POST /api/assessment            - Big Five тест үнэлгээ', { lineGap: 4 });
doc.text('POST /api/ai                    - AI интеграци', { lineGap: 4 });
doc.text('POST /api/upload                - CV хүлээн авалт', { lineGap: 4 });
doc.moveDown(0.5);

// User Roles
doc.fontSize(12).font('Helvetica-Bold').text('👥 Хэрэглэгчийн Үүрэг');
doc.fontSize(10).font('Helvetica');
doc.text('JOBSEEKER: Big Five тест өгч, ажил хайх, өргөдөл гаргах', { lineGap: 5 });
doc.text('EMPLOYER: Ажлын байр нийтлэх, өргөдлийг хянах, CV дүн сүнс', { lineGap: 5 });
doc.text('ADMIN: Системийн удирдлага (цаашид хэрэгжүүлэх)', { lineGap: 5 });
doc.moveDown(1);

// Footer
doc.fontSize(9).text('Generated: ' + new Date().toLocaleString('mn-MN'), { align: 'center', color: '#999999' });

doc.end();

stream.on('finish', () => {
  console.log('✅ PDF үүсгэлээ: ' + outputPath);
  process.exit(0);
});

stream.on('error', (err) => {
  console.error('❌ PDF үүсгэхэд алдаа:', err);
  process.exit(1);
});
