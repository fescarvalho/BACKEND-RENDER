export const gerarHtmlTemplate = (
    titulo: string, 
    corpo: string, 
    link: string, 
    textoBotao: string
  ) => {
    // Logo configurada
    const urlImagemLogo = "https://drive.google.com/uc?export=view&id=1bYIqqeD5_B6vvRmi-2qo9tkKFgU9GPt0";
    const anoAtual = new Date().getFullYear();
  
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${titulo}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center" style="padding: 40px 10px;">
              
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                
                <tr>
                  <td bgcolor="#111111" style="padding: 25px 20px; text-align: center;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="display: inline-block; vertical-align: middle;">
                      <tr>
                        <td style="padding-right: 15px; vertical-align: middle;">
                          <img src="${urlImagemLogo}" alt="Logo" width="55" height="55" style="display: block; border: 0; object-fit: contain;">
                        </td>
                        <td style="vertical-align: middle; text-align: left; border-left: 1px solid #333; padding-left: 15px;">
                          <h1 style="color: #C5A059; margin: 0; font-size: 20px; font-weight: 300; letter-spacing: 1px; font-family: serif; line-height: 1.2;">
                            LEANDRO ABREU
                          </h1>
                          <p style="color: #888; margin: 2px 0 0 0; font-size: 9px; text-transform: uppercase; letter-spacing: 3px;">
                            CONTABILIDADE
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
  
                <tr>
                  <td style="padding: 40px 30px;">
                    ${corpo}
                    
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" style="padding-top: 30px;">
                          <a href="${link}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: sans-serif; font-size: 16px; font-weight: bold; color: #000000; background-color: #C5A059; text-decoration: none; border-radius: 6px; transition: background-color 0.3s;">
                            ${textoBotao}
                          </a>
                        </td>
                      </tr>
                    </table>
  
                  </td>
                </tr>
  
                <tr>
                  <td bgcolor="#f9f9f9" style="padding: 30px 20px; text-align: center; border-top: 1px solid #eeeeee;">
                    <p style="margin: 0; font-size: 12px; color: #999999; line-height: 1.5;">
                      &copy; ${anoAtual} Leandro Abreu Contabilidade.<br>
                      Rua Dr. Raul Travassos, nº 03, Loja 02 - Natividade/RJ<br>
                      CNPJ: 34.117.554/0001-95<br>
                      Esta é uma mensagem automática, por favor não responda.
                    </p>
                  </td>
                </tr>
  
              </table>
            </td>
          </tr>
        </table>
  
      </body>
      </html>
    `;
  };