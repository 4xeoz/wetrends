#!/usr/bin/env node

/**
 * Image Optimization Script
 * Converts large PNG/JPEG images to optimized WebP format
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images');

// Image configurations: [filename, targetWidth, quality]
const imagesToOptimize = [
  // Hero images - full width, lower quality for backgrounds
  ['background 1.png', 1920, 70],
  ['Ellipse 1.png', 1920, 60],
  ['Ellipse 2.png', 1920, 60],
  ['Ellipse 3.png', 1920, 60],
  
  // Showcase/MacBook - large display
  ['MacBook-Pro-16.png', 1200, 75],
  
  // Team photos - smaller sizes
  ['beeca_ralph.png', 600, 75],
  ['iyad_cherifi.jpeg', 600, 75],
  ['person1.png', 600, 75],
  ['person2.png', 600, 75],
  ['person3.png', 600, 75],
  
  // Gradient backgrounds
  ['Gradient 27.png', 800, 60],
  ['Gradient 28.png', 800, 60],
  ['Gradient 29.png', 800, 60],
  ['Gradient 30.png', 1920, 60],
  ['Gradient 31.png', 800, 60],
  
  // Other backgrounds
  ['hero_background.png', 1920, 70],
  ['bg-wetrends-1.png', 1920, 70],
  ['Background-pattern.png', 800, 60],
];

async function optimizeImage(filename, targetWidth, quality) {
  const inputPath = path.join(imagesDir, filename);
  
  // Skip if source doesn't exist
  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  Skipping ${filename} (not found)`);
    return null;
  }
  
  const ext = path.extname(filename);
  const baseName = path.basename(filename, ext);
  const outputName = `${baseName}.webp`;
  const outputPath = path.join(imagesDir, outputName);
  
  try {
    // Get original file size
    const originalStats = fs.statSync(inputPath);
    const originalSizeMB = (originalStats.size / 1024 / 1024).toFixed(2);
    
    // Process image
    const sharpInstance = sharp(inputPath);
    
    // Get metadata
    const metadata = await sharpInstance.metadata();
    
    // Resize if wider than target
    if (metadata.width > targetWidth) {
      sharpInstance.resize(targetWidth, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      });
    }
    
    // Convert to WebP
    await sharpInstance
      .webp({ 
        quality: quality,
        effort: 6, // Higher effort = better compression (0-6)
        smartSubsample: true,
        reductionEffort: 6
      })
      .toFile(outputPath);
    
    // Get new file size
    const newStats = fs.statSync(outputPath);
    const newSizeMB = (newStats.size / 1024 / 1024).toFixed(2);
    const savings = ((originalStats.size - newStats.size) / originalStats.size * 100).toFixed(1);
    
    console.log(`✅ ${filename}`);
    console.log(`   ${originalSizeMB} MB → ${newSizeMB} MB (${savings}% smaller)`);
    
    return {
      original: filename,
      optimized: outputName,
      originalSize: originalSizeMB,
      newSize: newSizeMB,
      savings: savings
    };
    
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting image optimization...\n');
  
  const results = [];
  
  for (const [filename, width, quality] of imagesToOptimize) {
    const result = await optimizeImage(filename, width, quality);
    if (result) results.push(result);
  }
  
  // Summary
  console.log('\n📊 Summary:');
  console.log('─'.repeat(60));
  
  let totalOriginal = 0;
  let totalNew = 0;
  
  for (const r of results) {
    totalOriginal += parseFloat(r.originalSize);
    totalNew += parseFloat(r.newSize);
  }
  
  const totalSavings = ((totalOriginal - totalNew) / totalOriginal * 100).toFixed(1);
  
  console.log(`Total images optimized: ${results.length}`);
  console.log(`Original size: ${totalOriginal.toFixed(2)} MB`);
  console.log(`Optimized size: ${totalNew.toFixed(2)} MB`);
  console.log(`Space saved: ${(totalOriginal - totalNew).toFixed(2)} MB (${totalSavings}%)`);
  console.log('\n✨ Done! WebP images created alongside originals.');
  console.log('📝 Update your code to use .webp extensions.');
}

main().catch(console.error);
