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
  const bkgs = ['Background1','Background2','Background3','Background4'];
  const bkg = bkgs[Math.floor(Math.random()*bkgs.length)];
  await addLayer('Backgrounds', bkg, ctx);
  // Characters
  const character = 'Jack';
  if (Math.random > 0.7) character = 'Jill';
  if (Math.random > 0.99) character = 'James';
  await addLayer('Characters', character, ctx);
  // Eyes
  const arr = ['Green','Brown'];
  const eyes = arr[Math.floor(Math.random()*arr.length)];
  if (character === 'James') eyes = 'Blue';
  await addLayer('Eyes', eyes, ctx);
  // Add Some Text
  ctx.font = "20px Nunito"; // Nunito is the font, change this or download it from Google Fonts
  ctx.fillText(`${projectName} #${nftID} ${character}`, 20, 460);

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
