function create_station_survey(num, response) {
    let library = {
        1_1: 'Mario Kart Music, sped up or slowed down',
        1_2: 'Spongebob Music, maybe lofi?',
        1_3: 'Smooth Tunes, vibe to the max',
        1_4: 'Simple Jazz, maybe R&B?',

        2_1: 'Chaotic but Encouraging',
        2_2: 'Calming and Subtle',
        2_3: 'Powerful yet Restrained',
        2_4: 'Simple and Calm',
    }
}

function select_chip(self) {
    let parent = self.parentNode;
    for (let i = 0; i < parent.children.length; i++) {
        parent.children[i].classList.remove('active-chip');
    }
    self.classList.add('active-chip');
}

function multi_select_chip(self) {
    self.classList.toggle('active-chip');
}