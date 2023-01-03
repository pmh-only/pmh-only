export const WAKATIME_ENDPOINT_URL =
  'https://wakatime.com/share'

export const WAKATIME_TOTAL_STATICS_URL =
  `${WAKATIME_ENDPOINT_URL}/@pmh_only/4b833144-380e-4c3b-a0ec-5917c17ba03e.json`

export const WAKATIME_LANGUAGE_STATICS_URL =
  `${WAKATIME_ENDPOINT_URL}/@pmh_only/27fab207-0cd4-4572-8493-664ed8c35736.json`

export const GITHUB_ENDPOINT_URL =
  'https://api.github.com/users'

export const GITHUB_FOLLOWER_LIST_URL = (page: number): string =>
  `${GITHUB_ENDPOINT_URL}/pmh-only/follower?per_page=100&page=${page}`

export const GITHUB_FOLLOWING_LIST_URL = (page: number): string =>
  `${GITHUB_ENDPOINT_URL}/pmh-only/following?per_page=100&page=${page}`
