// @ts-check

import { HttpError } from '@/classes/HttpError.js'
import { simpleFetch } from '@/utils/simpleFetch.js'


/**
 * Simula un click en el boton con id = idButton
 * @param {string} idButton
 */
export function replyButtonClick(idButton) {
    const button = document.getElementById(idButton)
    const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
    button?.dispatchEvent(clickEvent)
}

/**
 * Simula un click en el boton con id = idButton
 * @param {HTMLElement | null | undefined} button
 */
export function replyElementButtonClick(button) {
    const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
    button?.dispatchEvent(clickEvent)
}

/**
 * Get data from API
 * @param {string} apiURL
 * @param {string} method
 * @param {Object} [data]
 * @returns {Promise<any>}
 */
export async function getAPIData(apiURL, method = 'GET', data) {
    let apiData

    try {
      let headers = new Headers()

      headers.append('Content-Type', 'application/json')
      headers.append('Access-Control-Allow-Origin', '*')
      if (data) {
        headers.append('Content-Length', String(JSON.stringify(data).length))
      }
      const userData = '123456'
      if (userData) {
        headers.append('Authorization', `Bearer ${userData}`)
      }
      apiData = await simpleFetch(apiURL, {
        // Si la petición tarda demasiado, la abortamos
        signal: AbortSignal.timeout(3000),
        method: method,
        body: data || undefined,
        headers: headers
      });
    } catch (/** @type {any | HttpError} */err) {
      if (err.name === 'AbortError') {
        console.error('Fetch abortado');
      }
      if (err instanceof HttpError) {
        if (err.response.status === 404) {
          console.error('Not found');
        }
        if (err.response.status === 500) {
          console.error('Internal server error');
        }
      }
    }

    return apiData
  }
