using System;
using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(AppDbContext context, ITokenService tokenService) : BaseApiController
{
    //api/account/register
    [HttpPost]
    [Route("register")]
    public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO)
    {
        //Make sure we do not re-use an existing email for registration
        if (await EmailExists(registerDTO.Email)) return Problem("Email Taken.");

        using var hmac = new HMACSHA512();

        var user = new AppUser
        {
            DisplayName = registerDTO.DisplayName,
            Email = registerDTO.Email,
            PasswordHash = hmac.ComputeHash(registerDTO.Password.GetBytes()),
            PasswordSalt = hmac.Key
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        return user.ToDto(tokenService);
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
    {
        //1.verify if the email given exist in the users table
        var user = await context.Users.SingleOrDefaultAsync(appUser => appUser.Email == loginDTO.Email);

        if (user == null) return Problem("Invalid email address", "account.login", 401);
        //2. valid the password to much the email address given 
        using var hmac = new HMACSHA512(user.PasswordSalt);

        var computedHash = hmac.ComputeHash(loginDTO.Password.GetBytes());

        for (var i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i] != user.PasswordHash[i]) return Problem("Invalid password", "account.login", 401);
        }

        return user.ToDto(tokenService);
    }
    // === HELPERS === //
    private async Task<bool> EmailExists(string email)
    {
        return await context.Users.AnyAsync(appUser => appUser.Email.ToLower() == email.ToLower());
    }
    
}
