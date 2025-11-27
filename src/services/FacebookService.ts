class FacebookService {
  private readonly appId: string
  private readonly appSecret: string
  private readonly graphApiVersion: string

  constructor() {
    this.appId = process.env.VUE_APP_FACEBOOK_APP_ID || ''
    this.appSecret = process.env.VUE_APP_WHATSAPP_APP_SECRET || ''
    this.graphApiVersion = process.env.VUE_APP_FACEBOOK_GRAPH_API_VERSION || 'v23.0'
  }

  loadSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).FB) {
        this.initSDK()
        resolve()
        return
      }

      const script = document.createElement('script')
      script.id = 'facebook-jssdk'
      script.src = 'https://connect.facebook.net/en_US/sdk.js'
      script.async = true
      script.defer = true
      script.onload = () => {
        this.initSDK()
        resolve()
      }
      script.onerror = () => reject(new Error('Failed to load Facebook SDK'))
      document.body.appendChild(script)
    })
  }

  private initSDK(): void {
    (window as any).fbAsyncInit = () => {
      (window as any).FB.init({
        appId: this.appId,
        autoLogAppEvents: true,
        xfbml: true,
        version: this.graphApiVersion
      })
      if ((window as any).FB) {
        (window as any).FB.AppEvents.logPageView()
      }
    }
  }

  launchEmbeddedSignup(configId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!(window as any).FB) {
        reject(new Error('Facebook SDK not loaded'))
        return
      }

      (window as any).FB.login(
        (response: any) => {
          if (response.authResponse?.code) {
            resolve(response.authResponse.code)
          } else {
            reject(new Error('User cancelled or did not authorize'))
          }
        },
        {
          config_id: configId,
          response_type: 'code',
          override_default_response_type: true,
          extras: {
            setup: {},
            featureType: 'whatsapp_business_app_onboarding',
            sessionInfoVersion: '3'
          }
        }
      )
    })
  }

  async exchangeCodeForToken(code: string): Promise<string> {
    const url = `https://graph.facebook.com/${this.graphApiVersion}/oauth/access_token?` +
      `client_id=${this.appId}&` +
      `client_secret=${this.appSecret}&` +
      `code=${code}`

    const response = await fetch(url)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to exchange code: ${errorText}`)
    }

    const data = await response.json()
    return data.access_token
  }

  async getWABAIdFromToken(accessToken: string): Promise<string> {
    const url = `https://graph.facebook.com/${this.graphApiVersion}/debug_token?` +
      `input_token=${accessToken}&` +
      `access_token=${this.appId}|${this.appSecret}`

    const response = await fetch(url)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to debug token: ${errorText}`)
    }

    const data = await response.json()

    if (data.data?.granular_scopes) {
      const wabaScope = data.data.granular_scopes.find((scope: any) =>
        scope.scope === 'whatsapp_business_management' ||
        scope.scope === 'whatsapp_business_messaging'
      )

      if (wabaScope?.target_ids?.length > 0) {
        return wabaScope.target_ids[0]
      }
    }

    throw new Error('WABA ID not found in token permissions')
  }

  async subscribeWabaToWebhook(wabaId: string, accessToken: string): Promise<void> {
    const url = `https://graph.facebook.com/${this.graphApiVersion}/${wabaId}/subscribed_apps`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        access_token: accessToken,
        subscribed_fields: JSON.stringify(['messages'])
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to subscribe WABA to webhook: ${errorText}`)
    }
  }

  async getPhoneNumbers(wabaId: string, accessToken: string): Promise<any[]> {
    const url = `https://graph.facebook.com/${this.graphApiVersion}/${wabaId}/phone_numbers?` +
      `access_token=${accessToken}`

    const response = await fetch(url)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to get phone numbers: ${errorText}`)
    }

    const data = await response.json()
    return data.data || []
  }
}

export default new FacebookService()
