import {bank} from './bank.js';
import {trailAssets} from '../core/skins/homeward-assets.js';
const categoryPictures={mammals:'lion',fish:'goldfish',bodies:'paw',places:'forest',actions:'run',young:'puppy'};
const categories=[['mammals','Meet the Mammals','Mammal names, including mammals that live in water.'],['fish','Meet the Fish','Fish names for comparing fish with mammals.'],['bodies','Bodies Up Close','Body parts and coverings.'],['places','Places & Food','Habitats, shelter, plants, food and water.'],['actions','What Animals Do','Action words.'],['young','Mothers & Young','Names for young mammals.']].map(([id,label,description])=>({id,label,description,image:`assets/topics/mammals/vocabulary/${categoryPictures[id]}.png`,imageAlt:description,assetStatus:'supplied'}));
const modeRows=[['learn','Meet the Words','Look, name and read together.'],['sort','Sort It','Find the word’s subject group.'],['detective','Detective','Guess the silhouette or reveal the picture.'],['identify','Which One Is It?','Choose from three words.'],['knowledge','Knowledge & Safety','Think, compare and care.'],['spelling','Homeward Trail','Help the rabbit hop home, letter by letter.'],['flip','Flip the Tiles','Find pairs at your own pace.'],['wheel','Spin the Wheel','Spin, pause and read.'],['story','Story Book','Read a mammal story together.'],['video','Video','Watch and discover together.'],['phonics','Phonics & Sight Words','Explore sounds and practise sight words.'],['create','Read, Draw & Talk','Read a sentence and talk together.']];
const questionRows=[
 ['air','What does a whale breathe?',['Air','Sand','Seawater'],'A whale uses lungs to breathe air at the surface.','traits'],
 ['fish-gills','What does a goldfish use to breathe in water?',['Gills','Fur','Paws'],'Gills take oxygen from the water.','compare'],
 ['milk','What do mammal mothers make to feed their young?',['Milk','Sand','Leaves'],'Mammal mothers produce milk for their young.','traits'],
 ['dolphin-group','Which animal is a mammal?',['Dolphin','Goldfish','Shark'],'A dolphin breathes air with lungs and feeds its young milk.','compare'],
 ['eggs','Which of these mammals lays eggs?',['Platypus','Cat','Elephant'],'Most mammals have live young; platypuses and echidnas lay eggs.','traits'],
 ['backbone','Which body part is a row of bones along the back?',['Backbone','Mane','Whiskers'],'Mammals have backbones. Fish have backbones too.','traits'],
 ['warm','What does warm-blooded mean here?',['The body makes heat to help stay warm','The animal must sit in hot water','The fur is always hot'],'Mammals make body heat, even when the air or water is cooler.','traits'],
 ['surface','Where must a dolphin go to breathe?',['The water surface','Deep into sand','Inside a shell'],'A dolphin brings its blowhole above the water to breathe.','compare'],
 ['young-cat','What is a young cat called?',['Kitten','Foal','Lamb'],'A kitten is a young cat.','young'],
 ['pouch','Where does a kangaroo joey stay when it is very small?',['Its mother’s pouch','An eggshell','A bird nest'],'A very young joey grows in its mother’s pouch.','young'],
 ['habitat','Where does a dugong find seagrass to eat?',['In shallow sea water','On a snowy mountain','In a dry cave'],'Dugongs eat seagrass in shallow coastal water.','homes'],
 ['whale-fish','Which pair contains one mammal and one fish?',['Whale and shark','Cat and dog','Salmon and eel'],'A whale is a mammal; a shark is a fish.','compare'],
 ['wildlife','A wild seal is resting on the beach. What should we do?',['Stay back with an adult','Touch its face','Give it a snack'],'Give wild animals space and follow local wildlife guidance.','care'],
 ['pet','Before touching someone’s dog, what should we do?',['Ask the owner and our adult','Pull its tail','Run up and shout'],'An adult helps us decide whether and how to meet a dog safely.','care'],
 ['land-water','Which animal spends its whole life in water but breathes air?',['Dolphin','Horse','Goldfish'],'A dolphin lives in water and breathes air at the surface.','homes'],
 ['wings','Which of these mammals can fly using wings?',['Bat','Rabbit','Mouse'],'Bats are mammals with skin-covered wings.','traits']
];
const readingRows=[
 ['cat','The cat has fur.','Read the supplied sentence, then name what covers the cat.','sentences'],
 ['dog','A big dog ran.','Read the supplied sentence. Find the action word; ran means run in the past.','sentences'],
 ['cat','Sit on the rug.','Read the supplied instruction; point to a classroom rug or act it out safely.','sentences'],
 ['whale','Whales are mammals because they breathe air.','This supplied frame gives one clue, not a complete definition: birds breathe air too. Add milk, hair at some life stage, and a backbone.','traits'],
 ['fur','Mammals have warm bodies.','Explain warm-blooded as making body heat; it does not mean every mammal feels hot to touch.','traits'],
 ['lion','This is a lion.','Use the source frame “This is a…” with other mammal names. Use “an elephant”.','sentences'],
 ['dolphin','A dolphin lives in water.','Use “A … lives on/in …”. Compare a horse on land. Some mammals use both.','homes'],
 ['milk','Mammal mothers feed their young milk.','Compare kitten/cat and calf/cow. Do not say every individual mammal nurses a baby.','young'],
 ['platypus','Most mammals have live young. A platypus lays eggs.','Correct the source’s overgeneralisation gently. Echidnas also lay eggs.','traits'],
 ['gills','A fish has gills. A dolphin has lungs.','Ask how each gets oxygen. Both have backbones.','compare'],
 ['whale','The whale comes up to breathe.','Draw this original caption from memory, then explain why it comes up.','compare'],
 ['joey','The joey is in the pouch.','Draw the caption or find the mother and baby in approved art when supplied.','young'],
 ['giraffe','The giraffe eats a leaf.','Draw the caption independently, then read it to the group.','sentences'],
 ['seal','We give the seal space.','Explain watching from a safe distance with an adult; follow local guidance.','care'],
 ['ocean-floor','The walrus finds food on the ocean floor.','The ocean floor is a feeding place, not somewhere a mammal can breathe underwater.','homes'],
 ['fur','Mammals have hair at some time in their lives.','Fur is a coat of hair, not a separate duplicate entry here. Whales may have only a few hairs.','traits']
];
const objectives=[['traits','Describe mammal traits','source-outline'],['compare','Compare marine mammals with fish','source-outline'],['homes','Describe land and water habitats','source-outline'],['sentences','Read captions and use sentence frames','source-outline'],['young','Connect mothers, milk and young','source-outline'],['care','Observe animals safely','draft-extension']].map(([id,label,provenance])=>({id,label,provenance,reviewStatus:'teacher-review-pending'}));
const questionCategories={traits:['mammals','bodies'],compare:['mammals','fish','bodies'],young:['young','mammals'],homes:['places','mammals'],care:['actions','mammals']};
const questions=questionRows.map(([id,prompt,choices,explanation,objectiveId])=>{
 const pictures=choices.map(label=>bank.find(item=>item.name===label.toLowerCase()));
 const usePictures=pictures.every(Boolean);
 return {id,prompt,choices:choices.map((label,i)=>({id:id+'-'+i,label,...(usePictures?{image:pictures[i].image,imageAlt:pictures[i].imageAlt,assetStatus:pictures[i].assetStatus}:{})})),correctChoiceId:id+'-0',explanation,objectiveId,categoryIds:questionCategories[objectiveId]};
});
const readingPractice=readingRows.map(([itemId,text,note,objectiveId],i)=>({id:'read-'+(i+1),itemId,text,note,objectiveId,type:i>8?'Read, draw & talk':'Read & talk together'}));
const objectiveForCategory={mammals:'traits',fish:'compare',bodies:'traits',places:'homes',actions:'sentences',young:'young'};
export const topic={
 id:'mammals',locale:'en-GB',title:'Mammal Discovery Club',subject:'OUR LIVING WORLD',subtitle:'From tiny paws to ocean giants. Let’s meet the mammals.',itemNoun:'word',description:'A local, teacher-led mammal field guide with eight learning activities.',
 launch:{clubBadge:'assets/topics/mammals/generated/club-badge.png',logoImage:'assets/topics/mammals/logo.png',logoAlt:'Mammal Discovery Club',backgroundImage:'assets/topics/mammals/generated/woodland-coast-empty.png',buttonImage:'assets/topics/mammals/start-button.png',assetStatus:'partial',sceneLayout:{width:1672,height:941,actors:['squirrel-idle','hedgehog-walk','bat-flight'],coordinateSpace:'source-image',landmarks:{leftMeadow:[280,675],rightMeadow:[1380,650],coast:[1440,355],foreground:[835,800]},protectedPadding:24}},
 theme:{primary:'#295e55',accent:'#cf9449',ink:'#263e39',cardColors:['#f3d7a4','#d4e2bd','#dce4e5','#edd2c2','#d7d2e6','#e4dfa8','#e9cdd6','#c4dfe0']},
 text:{alphabet:'abcdefghijklmnopqrstuvwxyz',normalisation:'NFC',spellingCase:'lower',ignoreCharacters:' -',learnPrompt:'Look, name and describe',correctItem:'You found it!',menuEyebrow:'OUR MAMMAL FIELD GUIDE',menuFootnote:'One collection. Choose a little adventure.',launchPrompt:'Let’s explore'},
 categories,categoryIntroductions:{countAsWords:false,includeInModes:[]},items:bank,knowledgeQuestions:questions,
 modes:modeRows.map(([id,label,description])=>({id,label,description,image:`assets/topics/mammals/menu/${id}.png`,assetStatus:'generated',artProvenance:'Created with built-in image generation, 5 October 2026',locked:['story','video','phonics'].includes(id),lockedReason:({story:'Coming soon — a theme-based book will be added.',video:'Coming soon — curated videos will be added.',phonics:'Coming soon — phonemes and sight-word activities will be added.'})[id] || ''})),
 detectiveDemo:{answer:'Elephant',scene:'assets/topics/mammals/detective/elephant-scene.png',cutout:'assets/topics/mammals/detective/elephant-cutout.png',alt:'An African elephant with large ears and a long trunk standing in a sunlit savanna.',status:'generated-test-artwork'},
 modeSkins:{spelling:{id:'homeward-trail',title:'Homeward Trail',instruction:'Find the letters to help the rabbit hop home. Nine incorrect guesses per word.',attempts:9,winAnnouncement:'The rabbit is heading home!',wrongAnnouncement:'One chance is used. Try another letter.',frames:trailAssets,assets:Object.values(trailAssets).map(frame=>frame.file)}},
 sessions:{defaultRoundCount:12,supportedFlipWordCounts:[10,20,30],wheel:{allWords:true,capacity:12,markerStrategy:'explicit-batches'}},
 curriculum:{source:'docs/curriculum-outline.png',period:'30 November–4 December (year not specified)',reviewStatus:'All drafted wording and extensions need teacher review.',objectives,readingPractice,sentenceFrames:['This is a/an … .','A … lives on/in … .','Mammal mothers feed their young milk.','The … has … .'],coverage:objectives.map(o=>({objectiveId:o.id,itemIds:o.id==='care'?['seal','dog']:bank.filter(x=>objectiveForCategory[x.categoryId]===o.id).map(x=>x.id),modeIds:o.id==='care'?['learn','knowledge']:['learn','identify','knowledge','wheel'],promptIds:[...questions,...readingPractice].filter(x=>x.objectiveId===o.id).map(x=>x.id)}))},
 completionMessages:{learn:'New words for your field guide!',sort:'Every word has a place in our guide.',identify:'Careful looking and reading!',knowledge:'Thoughtful answers about our living world.',spelling:'Wonderful words, one letter at a time.',flip:'Every pair together again.',wheel:'A whole world of words to read.'}
};
