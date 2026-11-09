/* Extra data for Graha Kendra: transit texts for fast planets, porondam tables, nakath rules and guide articles */

// Houses (counted from the Moon sign) where each planet's transit is favourable (Phaladeepika, gochara)
const GOCHARA_GOOD={Su:[3,6,10,11],Mo:[1,3,6,7,10,11],Ma:[3,6,11],Me:[2,4,6,8,10,11],Ju:[2,5,7,9,11],Ve:[1,2,3,4,5,8,9,11,12],Sa:[3,6,11],Ra:[3,6,11],Ke:[3,6,11]};
Object.assign(TR,{
 Su:['Tiredness, irritability and travel. Look after your health and avoid ego clashes.','Extra expenses and strained words in the family. Rest your eyes.','Success, a stronger position and good health. Rivals back off.','Worry and a restless home life. Avoid property disputes.','A restless mind and concern for children. Avoid hasty decisions.','Victory over rivals, recovery from illness and success at work.','Tiring travel and friction with your partner. Eat lightly.','Health concerns and trouble with officials. Slow down.','Low spirits and friction with your father or seniors. Be patient.','Recognition at work and new responsibilities.','Gains, promotion and good health. Wishes come true.','Spending, travel and tiredness. Rest more.'],
 Ma:['Short temper and minor injuries. Drive carefully.','Arguments over money and harsh words. Guard your savings.','Courage, gains and success in competition.','Quarrels at home and property issues. Stomach upsets.','Worry about children and impulsive choices.','Rivals defeated, debts cleared and strong energy.','Friction with your spouse and business partners.','Risk of accidents or injury. Avoid hazards.','Low energy and delays. Avoid risky journeys.','Pressure from bosses and obstacles at work.','Gains through land, property and hard work.','Spending, poor sleep and hidden opposition.'],
 Me:['Careless words and small losses. Double-check details.','Money through skill and communication.','Quarrels with siblings or neighbours. Think before speaking.','Progress in learning and happiness at home.','Disagreements with children or partners. Stay patient.','Success in exams, work and negotiations.','Misunderstandings in partnerships. Put agreements in writing.','Good news and clever solutions.','Obstacles in plans and study. Recheck travel details.','Success in career, trade and writing.','Gains, good friends and happy news.','Losses through carelessness. Keep documents safe.'],
 Ve:['Comfort, romance and pleasant company.','Money, good food and family happiness.','Success, gifts and help from friends.','Happiness at home and new comforts.','Romance, creativity and joy through children.','Friction with partners. Look after your kidneys.','Jealousy or friction in love. Talk openly.','Unexpected support and comforts.','Good fortune, travel and religious joy.','Quarrels at work. Keep work and romance apart.','Social success, gains and fulfilled wishes.','Pleasure and comfort, but spending rises.'],
 Ke:['Health worries and confusion. Keep routines simple.','Coolness in the family. Watch your words.','Courage and quiet success.','Unrest at home.','Anxiety and second thoughts.','Victory over problems.','Distance in relationships.','Sudden setbacks. Be cautious.','Doubts about faith or mentors.','Detours in career plans.','Gains from unexpected places.','A pull toward retreat and spiritual practice.']
});

// Porondam (Ashtakoota) tables
const YONI=['Horse','Elephant','Sheep','Serpent','Serpent','Dog','Cat','Sheep','Cat','Rat','Rat','Cow','Buffalo','Tiger','Buffalo','Tiger','Deer','Deer','Dog','Monkey','Mongoose','Monkey','Lion','Horse','Lion','Cow','Elephant'];
const YONI_ENEMY=[['Horse','Buffalo'],['Elephant','Lion'],['Sheep','Monkey'],['Serpent','Mongoose'],['Dog','Deer'],['Cat','Rat'],['Cow','Tiger']];
const NADI=i=>['Adi','Madhya','Antya','Antya','Madhya','Adi'][i%6];
const RAJJU=i=>['Pada (feet)','Kati (waist)','Nabhi (navel)','Kantha (neck)','Shiro (head)','Kantha (neck)','Nabhi (navel)','Kati (waist)','Pada (feet)'][i%9];
const VARNA=s=>[3,2,1,4,3,2,1,4,3,2,1,4][s]; // 4 Brahmin (water), 3 Kshatriya (fire), 2 Vaishya (earth), 1 Shudra (air)
const VARNA_N={4:'Brahmin',3:'Kshatriya',2:'Vaishya',1:'Shudra'};
const VASHYA=s=>['Q','Q','H','W','V','H','H','K','H','W','H','W'][s];
const VASHYA_N={Q:'Quadruped',H:'Human',W:'Water',V:'Wild',K:'Insect'};
const VASHYA_PTS={Q:{Q:2,H:1,W:1,V:.5,K:1},H:{Q:1,H:2,W:.5,V:0,K:1},W:{Q:1,H:.5,W:2,V:1,K:1},V:{Q:.5,H:0,W:1,V:2,K:0},K:{Q:1,H:1,W:1,V:0,K:2}};
const GANA_PTS={Deva:{Deva:6,Manushya:6,Rakshasa:1},Manushya:{Deva:5,Manushya:6,Rakshasa:0},Rakshasa:{Deva:1,Manushya:0,Rakshasa:6}};

// Nakath rules
const MUHURTA={
 marriage:{n:'Marriage',naks:[3,4,9,11,12,14,16,18,20,25,26],days:[1,3,4,5]},
 house:{n:'House-warming',naks:[3,4,11,13,16,20,22,23,25,26],days:[1,3,4,5]},
 travel:{n:'Starting a journey',naks:[0,4,6,7,12,16,21,22,26],days:[1,3,4,5,0]},
 business:{n:'Opening a business',naks:[0,3,7,11,12,13,16,20,21,25,26],days:[1,3,4,5]},
 vehicle:{n:'Buying a vehicle',naks:[0,6,7,12,13,14,21,22,26],days:[1,3,4,5]}
};
const GOOD_TITHI=[2,3,5,7,10,11,13]; // tithi numbers within a paksha

// Guide articles
const GUIDES={
 'guide-sade-sati':{t:'Sade Sati, without the fear',tag:'Transits',min:7,lede:'Sade Sati is the seven and a half years when Saturn moves through the sign before your Moon sign, your Moon sign itself, and the sign after it. It has a frightening reputation. Most of it is undeserved.',
  body:[['What actually happens','Saturn takes about two and a half years to cross one sign, so three signs take about seven and a half years. Saturn represents work, responsibility, patience and time. When it passes over your Moon, the planet of the mind, life asks you to carry more and to grow up a little. Pressure rises. So does maturity.'],
   ['The three phases','The first phase (Saturn in the 12th from your Moon) often brings expenses, travel, poor sleep or a move. The middle phase (Saturn over your Moon) is the most personal: responsibilities, tiredness and emotional weight. The last phase (Saturn in the 2nd) tends to touch money and family. Many people find the last phase brings the reward for the effort of the first two.'],
   ['Why it is not the same for everyone','If Saturn is a helpful planet for your rising sign (for Taurus and Libra rising it is the best planet of all), Sade Sati can bring promotion and lasting success. If Saturn is strong in your birth chart, the pressure turns into achievement. If it is weak or rules difficult houses for you, the period asks for more care.'],
   ['What helps','Keep steady routines. Avoid new debt and risky shortcuts. Look after your health and sleep. Serve elders, workers and people in need. Traditional practice includes Saturday charity of sesame or oil, lighting a sesame-oil lamp at dusk, and chanting Om Shanaishcharaya Namah or the Hanuman Chalisa.'],
   ['How to check yours','Your reading shows where Saturn is from your Moon right now and when it changes sign. Open the Timeline tab of your reading to see the dates.']]},
 'guide-lagna':{t:'Your lagna, the sign rising when you were born',tag:'Basics',min:5,lede:'Your lagna (ascendant) is the zodiac sign rising on the eastern horizon at the moment you were born. In Vedic astrology it is the most important point in your chart.',
  body:[['Why it matters so much','The lagna becomes your first house, and every other house is counted from it. That means the lagna decides which planet rules your career, which rules your marriage, which rules your money. Two people born on the same day but a few hours apart can have completely different charts.'],
   ['Why your birth time matters','The rising sign changes about every two hours, and the exact degree moves about one degree every four minutes. If your birth time is off by 15 to 30 minutes, your lagna can change, and with it the whole reading. If you are not sure of your time, ask a parent or check your birth certificate.'],
   ['Lagna, Moon sign and Sun sign','Western astrology talks mostly about the Sun sign. Vedic astrology uses three anchors: the lagna for your body, personality and life path; the Moon sign (rashi) for your mind and monthly forecasts; and the Sun for your soul and vitality. Your reading covers all three.'],
   ['The lagna lord','The planet that rules your rising sign is called the lagna lord. Where it sits in your chart shows where your life naturally points: toward career, family, learning, travel or service. It is also the planet whose gemstone is traditionally worn as a life stone.']]},
 'guide-porondam':{t:'Porondam, explained point by point',tag:'Marriage',min:9,lede:'Porondam (porutham in Tamil, kundali milan in India) compares two birth charts before marriage. The most widely used system scores eight factors out of a total of 36 points.',
  body:[['Varna (1 point)','Compares the spiritual temperament of the two Moon signs. A small factor.'],
   ['Vashya (2 points)','How naturally the two people influence and attract each other, from their Moon signs.'],
   ['Tara (3 points)','Counts from one birth star to the other. Some counts are favourable for health and wellbeing, others are not.'],
   ['Yoni (4 points)','Each birth star has an animal symbol. Same or friendly animals suggest physical and emotional compatibility; natural enemies (such as cat and rat) score zero.'],
   ['Graha maitri (5 points)','Friendship between the planets that rule the two Moon signs. It shows mental compatibility and how easily you understand each other.'],
   ['Gana (6 points)','Temperament: Deva (gentle), Manushya (human) or Rakshasa (intense). Very different ganas can clash.'],
   ['Bhakoot (7 points)','The distance between the two Moon signs. Certain distances (2-12, 5-9 and 6-8) are traditionally considered difficult for family life and finances.'],
   ['Nadi (8 points)','The most heavily weighted factor, linked to health and children. The same nadi for both partners scores zero.'],
   ['Reading the total','18 or more of 36 is traditionally acceptable, 24 or more is good, and 28 or more is excellent. Sri Lankan astrologers also check Rajju (the same rajju is avoided) and Kuja dosha in both charts.'],
   ['A sensible view','A score is a starting point, not a verdict. Astrologers look at the whole of both charts, and many happy marriages have modest scores. Use the Porondam tool to see each factor explained.']]}
};
