module.exports = {
    achievements: [
        {
            id: 'vk1',
            url: 'https?:\\/\\/(www\\.)?(vk\\.com|vkontakte\\.ru)\\/.*',
            title: 'Вконтактер',
            description: 'Был на вконтакте',
            rules: [{
                url: 'https?:\\/\\/(www\\.)?(vk\\.com|vkontakte\\.ru)\\/.*',
                type: 'navigation',
                hits: 10
            }]
        },
        {
            id: 'vk2',
            title: 'Вконтактер 80 уровня',
            description: 'Много раз был на вконтакте',
            // работает как availableAfter, но указывает на предыдущую ачивку
            parent: 'vk1',
            rules: [{
                url: 'https?:\\/\\/(www\\.)?(vk\\.com|vkontakte\\.ru)\\/.*',
                type: 'navigation',
                hits: 20
            }]
        },
        {
            id: 'vk3',
            title: 'Павел Дуров',
            description: 'Очень много раз был на вконтакте',
            availableAfter: ['vk2'],
            rules: [{
                type: 'navigation',
                url: 'https?:\\/\\/(www\\.)?(vk\\.com|vkontakte\\.ru)\\/.*',
                hits: 30
            }, {
                type: 'navigation',
                url: 'https?:\\/\\/(www\\.)?(durov\\.ru)\\/.*',
                hits: 1
            }]
        },
        {
            id: 'ok',
            title: 'Одноклассник',
            description: 'Много раз был на одноклассниках',
            rules: [{
                type: 'navigation',
                url: 'https?:\\/\\/(www\\.)?(ok\\.ru|odnoklassniki\\.ru)\\/.*',
                hits: 30
            }]
        }
    ],

    users: [
        {
            uid: 'uid1',
            salt: 'salt1'
        },
        {
            uid: 'uid2',
            salt: 'salt2'
        },
        {
            uid: 'uid3',
            salt: 'salt3'
        }
    ],

    userAchievements: {
        uid2: ['vk1'],
        uid3: ['ok']
    },

    userHits: {}
};
