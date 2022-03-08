import fs from 'fs';
import canvas from 'canvas';
import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';

// Basic Parameters
const projectName = 'Just Another NFT Drop';
const projectDescription = 'If you go to your grave without painting your masterpiece, it will not get painted - Gordon MacKenzie';
const projectURL = 'https://jamesbachini.com/';
const supply = 10000; // Number of NFT's to generate
const imageSize = {
  width: 512,
  height: 512,
};

const dir = {
  input : `./layers`,
  output: `./output`,
}

const drawImage= async (nftID) => {
  const blankCanvas = canvas.createCanvas(imageSize.width, imageSize.height);
  const ctx = blankCanvas.getContext("2d");
  ctx.attributes = [];

  /* Add layers using various methods here */

  // Backgrounds
  const bkgs = ['Background1','Background2','Background3'];
  const bkg = bkgs[Math.floor(Math.random()*bkgs.length)];
  await addLayer('Backgrounds', bkg, ctx);
  // Characters
  const character = 'Jack';
  if (Math.random > 0.7) character = 'Jill';
  if (Math.random > 0.99) character = 'James';
  await addLayer('Characters', character, ctx);
  // Eyes
  const eyeArray = ['Green','Brown'];
  let eyes = eyeArray[Math.floor(Math.random()*eyeArray.length)];
  if (character === 'James') eyes = 'Blue';
  await addLayer('Eyes', eyes, ctx);
  // Mouth
  const mouthArray = ['Happy','Sad'];
  let mouth = mouthArray[Math.floor(Math.random()*mouthArray.length)];
  if (nftID.toString().includes(420)) mouth = 'Smoking'; 
  await addLayer('Mouths', mouth, ctx);
  // Add Some Text
  ctx.fillStyle = "#ffffff"; 
  ctx.font = "20px Nunito, sans-serif"; // Nunito is the font, change this or download it from Google Fonts
  ctx.fillText(`${projectName} #${nftID} ${character}`, 120, 460);
  // Add Numeric Attributes With No Image Layers
  const strength = Math.floor(Math.random()*99);
  ctx.attributes.push({ 'trait_type': 'Strength', 'value': strength });
  // Finish By Adding A Vignette Overlay, Don't Need An Attribute For This
  const img = await canvas.loadImage(`${dir.input}/vignette.png`);
  ctx.drawImage(img,0,0,imageSize.width,imageSize.height);

  /* End of layers code */

  // save metadata
  fs.writeFileSync(`${dir.output}/metadata/${nftID}.json`,
    JSON.stringify({
      name: `${projectName} #${nftID}`,
      description: projectDescription,
      image: `${projectURL}images/${nftID}.png`,
      external_url: `${projectURL}nfts.html?id=${nftID}`,
      attributes: ctx.attributes,
    }, null, 2), (err) =>  { if (err) throw err });

  // save image 
  fs.writeFileSync(`${dir.output}/hdimages/${nftID}.png`, blankCanvas.toBuffer('image/png'));
  const files = await imagemin([`${dir.output}/hdimages/${nftID}.png`], {
    destination: `${dir.output}/images/`,
    plugins: [imageminPngquant({quality: [0.5, 0.6]})]
  });
  console.log(`Progress: ${nftID}/${supply}`);
}

const addLayer = async (traitType,val,ctx) => {
  const img = await canvas.loadImage(`${dir.input}/${traitType}/${val}.png`);
  ctx.drawImage(img,0,0,imageSize.width,imageSize.height);
  ctx.attributes.push({ 'trait_type': traitType, 'value': val });
}

const recreateOutputsDir = () => {
  if (fs.existsSync(dir.output))  fs.rmdirSync(dir.output, { recursive: true });
  fs.mkdirSync(dir.output);
  fs.mkdirSync(`${dir.output}/metadata`);
  fs.mkdirSync(`${dir.output}/hdimages`);
};

const main = async () => {
  recreateOutputsDir();
  for (var n = 1; n <= supply; n++) {
    await drawImage(n);
  }
};

(() => main())();
