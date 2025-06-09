using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AddressFinderAPI.Models;

namespace AddressFinderAPI.Controllers
{
    [ApiController]
    [Route("api/address")]
    public class AddressController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private const string ViaCepBaseUrl = "https://viacep.com.br/ws";

        public AddressController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [HttpGet("cep/{cep}")]
        public async Task<ActionResult<Address>> GetByCep(string cep)
        {
            var client = _httpClientFactory.CreateClient();

            try
            {
                var response = await client.GetAsync($"{ViaCepBaseUrl}/{cep}/json/");

                if (!response.IsSuccessStatusCode)
                {
                    return NotFound("CEP não encontrado");
                }

                var address = await response.Content.ReadFromJsonAsync<Address>();
                return Ok(address);
            }
            catch (HttpRequestException)
            {
                return StatusCode(503, "Serviço de consulta de CEP indisponível");
            }
        }

        [HttpGet("state-city")]
        public async Task<ActionResult<List<Address>>> GetByStateCity([FromQuery] string state, [FromQuery] string city)
        {
            var client = _httpClientFactory.CreateClient();

            try
            {
                var response = await client.GetAsync($"{ViaCepBaseUrl}/{state}/{city}/{Uri.EscapeDataString(city)}/json/");

                if (!response.IsSuccessStatusCode)
                {
                    return NotFound("Nenhum endereço encontrado para esta combinação de estado e cidade");
                }

                var addresses = await response.Content.ReadFromJsonAsync<List<Address>>();
                return Ok(addresses);
            }
            catch (HttpRequestException)
            {
                return StatusCode(503, "Serviço de consulta de endereços indisponível");
            }
        }
    }
}