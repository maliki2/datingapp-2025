using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace API.Services;

public class TokenService(IConfiguration config) : ITokenService
{
    public string CreateToken(AppUser user)
    {
        var tokenKey = config["TokenKey"] ?? throw new Exception("Cannot get token key");
        if (tokenKey.Length < 64)
            throw new Exception("Your token key needs to be 64 characters");
        SymmetricSecurityKey key = new(tokenKey.GetBytes());

        var claims = new List<Claim>
        {
            new (ClaimTypes.Email,user.Email),
            new(ClaimTypes.NameIdentifier, user.Id)
        };

        SecurityTokenDescriptor tokenDescriptor = new()
        {
            Subject = new(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new(key, SecurityAlgorithms.HmacSha256Signature)
        };

        JwtSecurityTokenHandler tokenHandler = new();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}
