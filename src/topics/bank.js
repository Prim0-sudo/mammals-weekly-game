// One collection. Rows: canonical name | definition | picture brief | sentence.
// All wording is drafted, including wording for source-provided concepts.
const groups = {
 mammals: `lion|A large wild cat; adult males often have a mane.|A male lion standing, with its mane and four paws visible.|The lion has a mane.
elephant|A very large mammal with a long trunk.|An elephant using its trunk, with large ears and four legs visible.|The elephant lifts its trunk.
giraffe|A tall mammal with a very long neck.|A giraffe reaching toward leaves, with its whole long neck visible.|The giraffe eats leaves.
monkey|A mammal with grasping hands; most kinds have tails.|A long-tailed monkey holding a branch with its hands.|The monkey holds a branch.
bear|A large mammal with thick fur and strong paws.|A brown bear standing on all four paws.|The bear has thick fur.
rabbit|A small mammal with long ears and strong back legs.|A rabbit with long ears and its back feet visible.|The rabbit can hop.
cat|A small mammal often kept as a pet.|A domestic cat showing its whiskers and paws.|The cat has fur.
dog|A mammal that people often keep as a companion.|A domestic dog with a visible nose, ears and four legs.|A big dog ran.
horse|A large mammal with hooves, often ridden by people.|A horse standing side-on with its mane and hooves visible.|The horse can run.
donkey|A hoofed mammal with long ears, related to a horse.|A grey donkey with long ears and a short upright mane.|The donkey has long ears.
cow|An adult female of the farm animal called cattle.|An adult cow standing with its udder visible without emphasis.|The cow eats grass.
sheep|A farm mammal with a coat of wool.|An adult sheep with a thick woolly coat.|The sheep has wool.
goat|A hoofed mammal that can climb well.|A goat standing on a low rock, with split hooves visible.|The goat stands on a rock.
pig|A mammal with a rounded snout used for sniffing and digging.|A domestic pig rooting in soil with its snout.|The pig sniffs the soil.
mouse|A small mammal with a pointed nose and a long thin tail.|A mouse beside a seed, with its thin tail visible.|The mouse finds a seed.
rat|A rodent usually larger than a mouse, with a long tail.|A rat beside a same-scale mouse outline for size comparison; focus on the rat.|The rat has a long tail.
hamster|A small rodent with cheek pouches for carrying food.|A hamster with gently rounded cheek pouches and a short tail.|The hamster carries food.
guinea pig|A small rodent with a rounded body and no visible tail.|A guinea pig standing with its short ears and rounded body visible.|The guinea pig eats hay.
squirrel|A rodent that often has a bushy tail.|A tree squirrel on a branch with a bushy tail.|The squirrel climbs a tree.
hedgehog|A small mammal with stiff spines on its back.|A hedgehog showing spines on its back and fur on its face.|The hedgehog has spines.
fox|A wild mammal in the dog family, often with a bushy tail.|A red fox with pointed ears and a bushy tail.|The fox has a bushy tail.
wolf|A large wild member of the dog family.|A grey wolf standing, with long legs and thick fur.|The wolf walks through the snow.
deer|A hoofed mammal; males of many kinds grow antlers.|A male red deer with branched antlers.|The deer has antlers.
moose|A very large deer; adult males have broad antlers.|An adult male moose with broad, flat antlers and a long face.|The moose stands by the lake.
zebra|An African mammal in the horse family with striped fur.|A zebra with black and white stripes and hooves.|The zebra has stripes.
rhinoceros|A large mammal with one or two horns on its nose.|A white rhinoceros with two nose horns, broad mouth and thick skin.|The rhinoceros has thick skin.
hippopotamus|A large mammal that spends much of the day in water.|A hippopotamus at the river surface with nostrils above water.|The hippopotamus comes up for air.
camel|A mammal with one or two humps that store fat.|A one-humped camel in a dry landscape.|The camel has a hump.
tiger|A large wild cat with stripes.|A tiger showing orange fur and dark stripes.|The tiger has stripes.
cheetah|A spotted wild cat that can run very fast.|A cheetah with spots, a slender body and dark tear marks.|The cheetah can run fast.
leopard|A wild cat with dark ring-like markings on its coat.|A leopard showing rosette markings, sturdy body and long tail.|The leopard rests on a branch.
gorilla|A large ape with no tail.|An adult gorilla with broad chest, long arms and no tail.|The gorilla has strong arms.
chimpanzee|An ape with grasping hands and no tail.|A chimpanzee showing long arms, hands and no tail.|The chimpanzee holds a fruit.
kangaroo|A mammal with strong back legs; females carry young in a pouch.|A female kangaroo with a visible pouch and long balancing tail.|The kangaroo can hop.
koala|An Australian mammal that eats mostly eucalyptus leaves.|A koala holding a eucalyptus branch, with rounded furry ears.|The koala rests in a tree.
wombat|An Australian mammal that digs burrows with strong claws.|A stocky wombat beside a burrow entrance.|The wombat digs a burrow.
platypus|A mammal with a broad bill and webbed feet that lays eggs.|A platypus showing its broad bill, fur and webbed front feet.|The platypus swims in a stream.
echidna|A mammal with spines and a long snout that lays eggs.|An echidna with strong claws, spines and a long narrow snout.|The echidna looks for ants.
bat|A mammal with skin-covered wings that can fly.|A fruit bat with wings spread to show skin stretched over long fingers.|The bat can fly.
sloth|A slow-moving mammal that spends much of its time in trees.|A sloth hanging safely from a branch by its curved claws.|The sloth hangs from a branch.
whale|A large sea mammal that breathes air through a blowhole.|A humpback whale surfacing, with horizontal tail flukes and blowholes inset.|The whale comes up for air.
dolphin|A sea mammal with a streamlined body and a blowhole.|A bottlenose dolphin at the surface, showing its single blowhole.|The dolphin breathes air.
porpoise|A small sea mammal with a rounded head and a short snout.|A harbour porpoise with rounded head and triangular dorsal fin.|The porpoise swims in the sea.
seal|A sea mammal with flippers; true seals have no outer ear flaps.|A harbour seal resting on a rock, showing small ear openings.|The seal rests on a rock.
sea lion|A sea mammal with flippers and small outer ear flaps.|A sea lion propped up on its large front flippers, ear flaps visible.|The sea lion has flippers.
walrus|A large sea mammal with whiskers; adults have long tusks.|An adult walrus showing paired tusks, whiskers and flippers.|The walrus has two tusks.
manatee|A large plant-eating mammal that lives in warm water.|A manatee with paddle-shaped tail and rounded snout eating plants.|The manatee eats water plants.
dugong|A sea mammal that eats seagrass and has a fluked tail.|A dugong with downturned snout and forked, whale-like tail.|The dugong eats seagrass.
sea otter|A sea mammal with thick fur that can float on its back.|A sea otter floating on its back with forepaws visible.|The sea otter floats on its back.
polar bear|A bear with thick fur that hunts on Arctic sea ice.|A polar bear on sea ice, showing broad furry paws.|The polar bear walks on sea ice.`,
 bodies: `fur|The thick coat of hair on many mammals.|A close view of rabbit fur, with the rabbit shown in a small context view.|The rabbit has soft fur.
whiskers|Long stiff hairs near the face that help an animal sense nearby things.|A cat face close-up with whiskers clearly indicated.|The cat has long whiskers.
skin|The outer covering of an animal's body.|A close view of elephant skin, with a small whole-elephant context.|The elephant has wrinkled skin.
paw|The foot of an animal such as a cat or bear.|A cat paw close-up showing pads and toes.|The cat lifts one paw.
hoof|A hard covering on the foot of a horse and some other mammals.|A horse hoof in close view with lower leg included.|The horse has a hard hoof.
claw|A hard curved point on an animal's toe.|A bear paw close-up with one claw clearly indicated.|The bear has a sharp claw.
tail|A body part that sticks out from the back end of many animals.|A squirrel with its bushy tail clearly indicated.|The squirrel has a long tail.
ear|A body part used for hearing.|A rabbit head with one ear clearly indicated.|The rabbit turns an ear.
eye|A body part used for seeing.|A horse face with one eye clearly indicated.|The horse has a brown eye.
nose|A body part used for smelling and breathing.|A dog face close-up with its nose clearly indicated.|The dog sniffs with its nose.
mouth|The opening through which an animal takes in food.|A goat head with the mouth clearly indicated, not frightening.|The goat opens its mouth.
tooth|A hard part in the mouth used to bite or chew.|A simple non-graphic horse mouth diagram showing one tooth.|The horse uses a tooth to chew.
tongue|A soft part inside the mouth that helps with tasting and eating.|A cat lapping water with its tongue visible.|The cat laps with its tongue.
trunk|An elephant's long nose and upper lip joined together.|An elephant face with trunk clearly indicated, reaching toward leaves.|The elephant uses its trunk.
tusk|A long tooth that sticks out of an animal's mouth.|A walrus head with one tusk clearly indicated.|The walrus has a long tusk.
horn|A hard growth on the head of some animals.|A goat head with one unbranched horn clearly indicated.|The goat has a curved horn.
antlers|Branched bony growths on the heads of deer, usually males.|A male red deer head showing branched antlers.|The deer grows antlers.
mane|Long hair around the neck or along the top of the neck.|A male lion with its mane clearly indicated.|The lion has a thick mane.
pouch|A fold of skin in which some mammals carry their young.|A kangaroo mother with a joey in her pouch.|The joey rests in a pouch.
flipper|A broad, flat limb used for moving in water.|A seal with one front flipper clearly indicated.|The seal moves a flipper.
blowhole|A breathing opening on top of a whale's or dolphin's head.|A dolphin at the surface with its blowhole clearly indicated.|The dolphin breathes through its blowhole.
lungs|Body organs that take oxygen from air.|A simple child-friendly mammal body diagram highlighting paired lungs.|Mammals breathe air into their lungs.
backbone|The row of bones along the back that helps support the body.|A simple non-graphic dog skeleton outline with backbone highlighted.|The dog has a backbone.`,
 places: `land|The solid ground, rather than water.|A simple coastline with the solid land highlighted.|The lion walks on land.
ocean|A very large area of salty water.|A wide ocean view with a whale far in the water for scale.|The whale lives in the ocean.
ocean floor|The ground at the bottom of the ocean.|A cutaway sea view with the bottom clearly highlighted.|The walrus finds food on the ocean floor.
river|A long flowing stream of water.|A flowing river with clear banks and a visible bend.|The dolphin swims in the river.
lake|A large area of water surrounded by land.|A lake with land visible all around its edges.|The moose stands by the lake.
pond|A small area of still water surrounded by land.|A small pond in a grassy area.|The horse drinks by the pond.
forest|A large area with many trees.|A forest with many trees and a clear path.|The deer lives in the forest.
grassland|An open area where mostly grasses grow.|An open grassy plain with few trees and distant zebras.|The zebra walks across the grassland.
desert|A place that gets very little rain.|A dry desert landscape with sparse plants.|The camel walks in the desert.
cave|A hollow space in rock that an animal can enter.|A rocky cave entrance with the inside visible.|The bat rests in a cave.
burrow|A hole or tunnel dug by an animal as a shelter.|A cutaway wombat burrow showing the entrance and tunnel.|The wombat rests in its burrow.
den|A sheltered resting place used by some wild mammals.|A fox resting in a sheltered hollow under tree roots.|The fox rests in its den.
branch|A woody part that grows out from a tree trunk.|A tree with one side branch clearly indicated.|The monkey sits on a branch.
leaf|A usually flat plant part that catches light.|A single fresh leaf with its outline and stalk visible.|The giraffe eats a leaf.
grass|Plants with narrow green leaves, often covering the ground.|A close view of growing grass blades.|The cow eats grass.
fruit|A plant part that holds seeds, such as an apple.|A whole apple and a cut apple showing seeds.|The monkey eats fruit.
seed|A plant part from which a new plant can grow.|Several sunflower seeds with one enlarged seed.|The mouse finds a seed.
milk|A liquid made by mammal mothers to feed their young.|A calf nursing from its mother in a gentle, clear side view.|The calf drinks its mother's milk.
water|The liquid animals need to drink.|Clear water in a shallow pool with a deer drinking.|The deer drinks water.
snow|Soft white ice crystals that fall in cold weather.|Snow on the ground with visible animal tracks.|The wolf walks through snow.
sea ice|Frozen seawater floating on the ocean.|A floating sea-ice sheet with water visible around its edge.|The polar bear rests on sea ice.
seagrass|Flowering plants that grow underwater in shallow seas.|Seagrass rooted in a sandy seabed, with a dugong nearby for context.|The dugong eats seagrass.`,
 actions: `walk|To move by taking steps.|A bear walking, with sequential foot positions in two panels.|The bear can walk.
run|To move quickly using the legs.|A horse running, with two clear movement poses.|The horse can run.
hop|To move with small jumps, often using the back legs.|A rabbit hopping with two poses and a short movement arrow.|The rabbit can hop.
jump|To push off and leave the ground.|A cat jumping up onto a low ledge, with start and landing shown.|The cat can jump.
climb|To move upward using feet or hands.|A squirrel climbing a tree trunk.|The squirrel can climb.
swim|To move through water.|A dolphin swimming below the surface.|The dolphin can swim.
dive|To go down below the surface of water.|A seal moving from the surface down into water.|The seal can dive.
float|To stay at the surface of water.|A sea otter lying on its back at the surface.|The sea otter can float.
fly|To move through the air using wings.|A bat flying with its skin-covered wings spread.|The bat can fly.
dig|To move soil aside to make a hole.|A wombat moving soil with its front claws.|The wombat can dig.
sniff|To draw air into the nose to smell something.|A dog with its nose close to the ground, sniffing a trail.|The dog can sniff.
chew|To break food into smaller pieces with the teeth.|A horse chewing grass, shown in a clear face close-up.|The horse can chew.
drink|To take liquid into the mouth.|A cat lapping water from a bowl.|The cat can drink.
feed|To give food to a baby or another animal.|A mother cow feeding her calf with milk, no human feeding wildlife.|The mother can feed her calf.
breathe|To take air into the body and let it out.|A whale at the surface with a simple air-flow inset, no underwater breathing.|The whale comes up to breathe.
sleep|To rest with the body and mind less active.|A curled-up cat asleep, relaxed eyes closed.|The cat can sleep.
stretch|To reach out and lengthen the body or a limb.|A cat extending its front legs in a stretch.|The cat can stretch.
groom|To clean or care for fur or skin.|A cat licking its own fur, with the action clearly visible.|The cat can groom its fur.
carry|To hold and move something from one place to another.|A monkey walking while holding a fruit.|The monkey can carry fruit.
hide|To move or stay where it is hard to be seen.|A mouse partly hidden behind a log, still identifiable.|The mouse can hide.`,
 young: `kitten|A young cat.|A kitten next to its adult mother for size context.|The kitten has soft fur.
puppy|A young dog.|A puppy next to its adult mother for size context.|The puppy drinks milk.
calf|A young cow; the young of some other large mammals are also called calves.|A young calf beside an adult cow.|The calf stands by its mother.
lamb|A young sheep.|A lamb beside an adult sheep.|The lamb has wool.
kid|A young goat.|A young goat beside an adult goat, clearly not a human child.|The kid can jump.
foal|A young horse or another young member of the horse family.|A foal with long legs standing beside a mare.|The foal stands by the horse.
cub|A young bear, lion or some other wild mammals.|A lion cub beside an adult lioness.|The cub rests by its mother.
joey|A young kangaroo or another young marsupial.|A kangaroo joey peeking out from its mother's pouch.|The joey is in the pouch.`
};
const source = new Set('lion,elephant,giraffe,monkey,bear,rabbit,dolphin,whale,fur,backbone,milk,land,water,ocean floor,cat,dog'.split(','));
export const bank=Object.entries(groups).flatMap(([categoryId,raw])=>raw.split('\n').map(line=>{
 const [name,definition,imageAlt,sentence]=line.split('|');
 const id=name.replaceAll(' ','-');
 const generated=false;
 return {id,name,categoryId,definition,imageAlt,sentence,kind:'word',image:`assets/topics/mammals/vocabulary/${id}.png`,assetStatus:'supplied',artProvenance:({horn:'User-supplied Goat Head with Two Curved Horns-2.png',tusk:'User-supplied Front-facing walrus with two visible tusks-1.png'})[id] || 'User-supplied Mammal_Discovery_Club_132_Game_Assets.zip; imported byte-for-byte, 5 October 2026',provenance:source.has(name)?'source-concept':'draft-extension',reviewStatus:'teacher-review-pending'};
}));
