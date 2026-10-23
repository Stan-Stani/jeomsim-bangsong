/* Settings for the shared engine (walk-engine): this game's names, storage prefix and default player. */
var GAME={prefix:'banghu',music:{by:'kimlinkku (Free Music Loop Pack)',url:'https://kimlinkku.itch.io/free-music-loop-pack'},title:'점심 방송',log:'단어 일지',
 /* spaced review: due again after 2 story beats or 5 minutes, then 5 beats or 20 minutes (★ within one 교시); later levels are
    hours and days, and one shared record lets a later 교시 bring earlier words back (class time, the notebook, the last round) */
 srs:{start:1,gap:[0,5*60e3,20*60e3,4*3600e3,24*3600e3,3*24*3600e3],beats:[0,2,5],shared:1},
 term:{name:'복습 노트',allWords:n=>[`단어 ${n}개를 다 모았어요!`,'복습할수록 ★가 늘어나요. 사람들도, 복습 노트도 물어봐요.']},
 player:{hair:'#2A2F4A',skin:'#F1C9A5',shirt:'#F4F2EA',pants:'#2B3A5C',belt:'#9B2D30'}};
