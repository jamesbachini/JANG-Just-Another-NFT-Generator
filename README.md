# Jang.js | Just Another NFT Generator

Jang.js is a Javascript tool used to create custom artwork for NFT collections. There were lots of simple NFT generators that created collections based on the images in a directory but I wanted the ability to add custom logic when building up artwork layers.

## Instructions

You'll need Node.js installed from https://nodejs.org

Then open up a terminal/console and clone the directory and install dependencies.

```
git clone https://github.com/jamesbachini/JANG-Just-Another-NFT-Generator.git
cd JANG-Just-Another-NFT-Generator/
npm install
```

From there you can open up jang.js in a text editor and change the project name, description, URL etc.

Once you have the basic settings done it's time to start creating layers. Start with a background or collection of backgrounds and then build on top of that. All the code after   /* Add layers using various methods here */ can be modified to suit your individual project.

The layer is added using the following command. The first parameter should be the directory the layers are stored in i.e layers/Backgrounds, the second parameter should be the filename without the .png, this is also written to the metadata file for the NFT so name it something descriptive, the final parameter is constant and we just pass a pointer to the canvas object as ctx.

```javascript
await addLayer('Backgrounds', 'Background1', ctx);
```

## Examples

Random from array
```javascript
const arr = ['Background1','Background2','Background3','Background4'];
const bkg = arr[Math.floor(Math.random()*arr.length)];
await addLayer('Backgrounds', bkg, ctx);
```

Generating playing cards from nftID (can be used in the smart contract too)
```javascript
// Numbers
const cardNumber = n % 13 + 1;
await addLayer('Numbers', cardNumber, attributes, ctx);
// Suits
const suitRef = n % 4;
const arr = ['Spades','Hearts','Diamonds','Clubs'];
const suit = arr[suitRef];
await addLayer('Suits', suit, attributes, ctx);
```

Custom rarity with some randomness
```javascript
const character = 'Jack';
if (Math.random > 0.7) character = 'Jill';
if (Math.random > 0.99) character = 'James';
await addLayer('Characters', character, ctx);
```

Super rare one offs (Will front-load the rare NFT's to earlier ID's)
```javascript
const arr = ['Human','Ape','Mutant','Punk','Loogie']; // put this array outside of the loop at the top of the script
const attr = arr[Math.floor(Math.random()*arr.length)];
if (attr === 'Punk') arr.splice(3,1); // removes Punk at array index 3 (starts at 0) out of the array
await addLayer('AvatarType', attr, ctx);
```

Specific traits for specific ID's
```javascript
const arr = ['Happy','Sad'];
const mouth = arr[Math.floor(Math.random()*arr.length)];
if (nftID.includes(420)) mouth = 'Smoking'; 
await addLayer('Eyes', mouth, ctx);
```

Add Numeric Attributes With No Image Layers
```javascript
const strength = Math.floor(Math.random()*99);
ctx.attributes.push({ 'trait_type': 'Strength', 'value': strength });
```

Add a image layer or filter but no attribute
```javascript
const img = await canvas.loadImage(`${dir.input}/vignette.png`);
ctx.drawImage(img,0,0,imageSize.width,imageSize.height);
```

Feel free to add more examples above this line via a pull request.

## Compression

The generator outputs two directories output/hdimages/ and output/images/

The HD images are the raw output of the generator. The output/images directory holds compressed images.

Compression is useful as uploading 10,000 high res images to IPFS is about as much fun as [redacted].

You can change the compression settings to make the images higher quality or lower file size.

High Quality Larger Size
```javascript
    plugins: [imageminPngquant({quality: [0.5, 0.7]})]
```
Low Quality Smaller Size
```javascript
    plugins: [imageminPngquant({quality: [0.3, 0.5]})]
```
More options and spec here: https://github.com/imagemin/imagemin-pngquant#readme

## More Information

There's more info on blockchain development and NFT's on my blog at https://jamesbachini.com

To upload your NFT's to IPFS check out https://nft.storage or https://www.pinata.cloud/

For creating the smart contract check out OpenZepellin's ERC721 token library and documentation: https://docs.openzeppelin.com/contracts/4.x/erc721

For compiling and deploying the contract you can use https://remix.ethereum.org