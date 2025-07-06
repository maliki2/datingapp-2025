using System;
using System.Text;

namespace API.Extensions;

public static class StringExtensions
{
    public static byte[] GetBytes(this string text)
    {
        return Encoding.UTF8.GetBytes(text);
    }
}
