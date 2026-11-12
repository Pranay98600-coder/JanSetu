
package com.jansetu.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.*;

public record CreateComplaintRequest(

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 150)
    String title,

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 5000)
    String description,

    @NotBlank(message = "Category is required")
    @Pattern(
        regexp = "ROADS|WATER|SANITATION|STREETLIGHT|DRAINAGE|GARBAGE|OTHER",
        message = "Invalid complaint category"
    )
    String category,

    @NotBlank(message = "Address is required")
    @Size(max = 255)
    String address,

    @DecimalMin(value = "-90.0")
    @DecimalMax(value = "90.0")
    BigDecimal latitude,

    @DecimalMin(value = "-180.0")
    @DecimalMax(value = "180.0")
    BigDecimal longitude

) {
    @AssertTrue(message = "Latitude and longitude must both be provided or both omitted")
    public boolean isCoordinatePairValid() {
        return (latitude == null) == (longitude == null);
    }
}
