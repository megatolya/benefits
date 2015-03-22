module.exports = {
    achievements: [
        {
            id: 'vk1',
            url: 'https?:\\/\\/(www\\.)?(vk\\.com|vkontakte\\.ru)\\/.*',
            type: 'navigation',
            hits: 50,
            title: 'Вконтактер',
            description: 'Много раз был на вконтакте'
        },
        {
            id: 'vk2',
            url: 'https?:\\/\\/(www\\.)?(vk\\.com|vkontakte\\.ru)\\/.*',
            type: 'navigation',
            hits: 100,
            title: 'Вконтактер 2',
            description: 'Много раз был на вконтакте'
        },
        {
            id: 'vk3',
            url: 'https?:\\/\\/(www\\.)?(vk\\.com|vkontakte\\.ru)\\/.*',
            type: 'navigation',
            hits: 120,
            title: 'Вконтактер 3',
            description: 'Много раз был на вконтакте'
        },
        {
            id: 'ok',
            url: 'https?:\\/\\/(www\\.)?(ok\\.ru|odnoklassniki\\.ru)\\/.*',
            type: 'navigation',
            hits: 100,
            title: 'Одноклассник',
            description: 'Много раз был на вконтакте'
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

    userAchivements: {
        uid2: ['vk1'],
        uid3: ['ok']
    },

    userHits: {
        uid1: {
            vk1: 10,
            vk2: 10
        },
        uid2: {
            ok: 10
        }
    }
};
