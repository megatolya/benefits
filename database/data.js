module.exports = {
    achievements: [
        {
            // id: 1,
            url: 'https?:\\/\\/(www\\.)?(vk\\.com|vkontakte\\.ru)\\/.*',
            name: 'Вконтактер',
            description: 'Был на вконтакте',
            image: 'vk.png',
            children: [3],
            tags: [1],
            rules: [1]
        },
        {
            // id: 2,
            name: 'Вконтактер 80 уровня',
            description: 'Много раз был на вконтакте',
            image: 'vk.png',
            children: [1, 3],
            tags: [1],
            rules: [2]
        },
        {
            // id: 3,
            name: 'Павел Дуров',
            description: 'Очень много раз был на вконтакте',
            image: 'durov.jpg',
            children: [4],
            tags: [1],
            rules: [3, 4]
        },
        {
            // id: 4,
            name: 'Одноклассник',
            description: 'Много раз был на одноклассниках',
            image: 'ok.png',
            children: [2],
            tags: [2],
            rules: [5]
        },
        {
            // id: 5,
            name: 'Птенчик',
            description: 'Меньше 10 фолловеров в твиттере',
            image: 'twitter.png',
            children: [],
            tags: [3],
            rules: [6]
        },
        {
            // id: 6,
            name: 'Тебя знают на районе',
            description: 'Болше 50 фолловеров в твиттере',
            image: 'twitter.png',
            children: [],
            tags: [3],
            rules: [7]
        },
        {
            // id: 7,
            name: 'Широко известен в узких кругах',
            description: 'Болше 500 фолловеров в твиттере',
            image: 'twitter.png',
            children: [],
            tags: [3],
            rules: [8]
        }
    ],

    tags: [
        {
            // id: 1,
            name: 'vk'
        },
        {
            // id: 2,
            name: 'ok'
        },
        {
            // id: 3,
            name: 'twitter'
        }
    ],

    rules: [
        {
            // id: 1,
            url: 'https?:\\/\\/(www\\.)?(vk\\.com|vkontakte\\.ru)\\/.*',
            type: 'navigation',
            aim: 10
        }, {
            // id: 2,
            url: 'https?:\\/\\/(www\\.)?(vk\\.com|vkontakte\\.ru)\\/.*',
            type: 'navigation',
            aim: 20
        }, {
            // id: 3,
            url: 'https?:\\/\\/(www\\.)?(vk\\.com|vkontakte\\.ru)\\/.*',
            type: 'navigation',
            aim: 30
        }, {
            // id: 4,
            type: 'navigation',
            url: 'https?:\\/\\/(www\\.)?(ok\\.ru|odnoklassniki\\.ru)\\/.*',
            aim: 30
        }, {
            // id: 5,
            type: 'navigation',
            url: 'https?:\\/\\/(www\\.)?(durov\\.ru)\\/.*',
            aim: 1
        }, {
            // id: 6,
            type: 'compareLess',
            field: 'followers_count',
            aim: 5
        }, {
            // id: 7,
            type: 'compareMore',
            field: 'followers_count',
            aim: 20
        }, {
            // id: 8,
            type: 'compareMore',
            field: 'followers_count',
            aim: 500
        }
    ],

    users: [
        {
            // id: 1,
            salt: 'salt1',
            name: 'Николай',
            achievements: [1]
        },
        {
            // id: 2,
            salt: 'salt2',
            name: 'Степан',
            achievements: [4]
        },
        {
            // id: 3,
            salt: 'salt3',
            name: 'Наташа',
            achievements: [1, 2, 3]
        }
    ],

    hits: [
        {
            userId: 1,
            ruleId: 1,
            count: 12
        }
    ]
};
